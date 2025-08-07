import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Order from '@/lib/models/order';

// Save order to database when placing order
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { customerDetails, cartSummary, orderNumber } = body;

    console.log('Received order data:', { customerDetails, cartSummary, orderNumber });

    // Validate required fields
    if (!customerDetails.name || !customerDetails.phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    if (!cartSummary || !cartSummary.items || cartSummary.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create new order
    const order = new Order({
      orderNumber,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email || '',
      deliveryAddress: customerDetails.address,
      pincode: customerDetails.pincode,
      items: cartSummary.items,
      totalItems: cartSummary.totalItems,
      subtotal: cartSummary.totalPrice,
      deliveryCharge: cartSummary.deliveryCharge,
      totalAmount: cartSummary.finalTotal,
      status: 'Order Placed',
      whatsappSent: true,
      orderDate: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully',
      orderNumber: orderNumber,
      orderId: order._id
    });

  } catch (error) {
    console.error('Order API Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to process order: ${error.message}` },
      { status: 500 }
    );
  }
}

// Get orders for admin panel
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Update order status and payment status
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { orderId, status, paymentStatus, paymentMethod, notes } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};

    // Validate and update order status if provided
    if (status) {
      const validStatuses = ['Order Placed', 'Assigned', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid order status' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Validate and update payment status if provided
    if (paymentStatus) {
      const validPaymentStatuses = ['Not Paid', 'Paid', 'Refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { error: 'Invalid payment status' },
          { status: 400 }
        );
      }
      updateData.paymentStatus = paymentStatus;
      
      // Set payment date when marked as paid
      if (paymentStatus === 'Paid') {
        updateData.paymentDate = new Date();
      }
    }

    // Update payment method if provided
    if (paymentMethod) {
      const validPaymentMethods = ['Cash on Delivery', 'Online Payment', 'Bank Transfer', 'UPI'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
      }
      updateData.paymentMethod = paymentMethod;
    }

    // Update notes if provided
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// Delete order
export async function DELETE(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
