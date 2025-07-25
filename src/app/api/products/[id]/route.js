import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import { verifyAdmin } from '@/lib/auth-helpers';

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await request.json();
    const {
      productName,
      description,
      productDetails,
      productCategory,
      productMRP,
      offerPercentage,
      productType,
      customTextHeading,
      numberOfCustomImages,
      images
    } = body;
    
    // Validation
    if (!productName || !description || !productDetails || !productCategory || !productMRP) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one product image is required' },
        { status: 400 }
      );
    }
    
    // Validate product type specific fields
    if ((productType === 'customisable' || productType === 'heavyCustomisable') && !customTextHeading) {
      return NextResponse.json(
        { success: false, error: 'Custom text heading is required for customizable products' },
        { status: 400 }
      );
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        description,
        productDetails,
        productCategory,
        productMRP: parseFloat(productMRP),
        offerPercentage: parseFloat(offerPercentage) || 0,
        productType,
        customTextHeading: customTextHeading || '',
        numberOfCustomImages: parseInt(numberOfCustomImages) || 0,
        images,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
