import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    console.log('🔍 Checking product ID availability:', productId);
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if product ID already exists
    const existingProduct = await Product.findOne({ 
      productId: productId.toLowerCase().trim() 
    });
    
    const available = !existingProduct;
    
    console.log('✅ Product ID availability check result:', {
      productId: productId.toLowerCase().trim(),
      available,
      existingProductId: existingProduct?._id
    });
    
    return NextResponse.json({
      success: true,
      available,
      message: available 
        ? 'Product ID is available' 
        : 'Product ID is already taken'
    });
    
  } catch (error) {
    console.error('💥 Error checking product ID:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check product ID' },
      { status: 500 }
    );
  }
}
