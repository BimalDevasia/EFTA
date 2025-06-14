import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';

// This is an optional API route for storing orders in database
// Currently, orders are primarily sent via WhatsApp
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { customerDetails, cartSummary, orderNumber } = body;

    // Validate required fields
    if (!customerDetails.name || !customerDetails.phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    // Here you could save the order to your database
    // Example:
    // const order = new Order({
    //   orderNumber,
    //   customerName: customerDetails.name,
    //   customerPhone: customerDetails.phone,
    //   customerEmail: customerDetails.email,
    //   deliveryAddress: customerDetails.address,
    //   items: cartSummary.items,
    //   totalAmount: cartSummary.finalTotal,
    //   status: 'pending',
    //   orderDate: new Date(),
    // });
    // await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order received successfully',
      orderNumber: orderNumber
    });

  } catch (error) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get orders (for admin panel)
    // const orders = await Order.find().sort({ orderDate: -1 });
    
    return NextResponse.json({
      success: true,
      orders: [] // Return actual orders from database
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
