import { connectDB } from '@/lib/mongoose';
import Product from '@/lib/models/product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if product ID already exists
    const existingProduct = await Product.findOne({ productId: productId.toLowerCase() });
    
    return NextResponse.json({
      available: !existingProduct,
      productId: productId.toLowerCase()
    });
    
  } catch (error) {
    console.error('Error checking product ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
