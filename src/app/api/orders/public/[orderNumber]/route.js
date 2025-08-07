import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/lib/models/order";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { orderNumber: encodedOrderNumber } = params;
    
    if (!encodedOrderNumber) {
      return NextResponse.json({
        success: false,
        message: "Order number is required"
      }, { status: 400 });
    }

    // Decode the URL-encoded order number
    const orderNumber = decodeURIComponent(encodedOrderNumber);

    // Find the order by order number
    const order = await Order.findOne({ orderNumber: orderNumber });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found"
      }, { status: 404 });
    }

    // Return order data (excluding sensitive information if needed)
    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        deliveryAddress: order.deliveryAddress,
        pincode: order.pincode,
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentDate: order.paymentDate,
        orderDate: order.orderDate,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error("Error fetching public order details:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}
