import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import ProductCategory from '@/lib/models/productCategory';
import { verifyAdmin } from '@/lib/auth-helpers';
import { formatProductTextCasing } from '@/utils/textFormatting';

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
      console.log('❌ Admin verification failed');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    console.log('📝 Updating product with ID:', id);
    
    const rawBody = await request.json();
    console.log('📥 Raw body received:', rawBody);
    
    // Apply proper case formatting to the data
    const body = formatProductTextCasing(rawBody);
    console.log('📝 Formatted body:', body);
    
    const {
      productId,
      productName,
      description,
      productDetails,
      productCategory,
      specifications,
      whatsInside,
      productMRP,
      offerType,
      offerPercentage,
      offerPrice,
      productType,
      giftType,
      images,
      tags,
      colors,
      isVisible,
      isFeatured
    } = body;
    
    console.log('📊 Extracted fields:', {
      productName,
      productCategory,
      productMRP,
      offerType,
      offerPercentage,
      offerPrice,
      productType,
      giftType,
      imagesCount: images?.length,
      isVisible,
      isFeatured
    });
    
    // Validation
    if (!productName || !description || !productDetails || !productCategory || !productMRP) {
      console.log('❌ Missing required fields:', {
        productName: !!productName,
        description: !!description,
        productDetails: !!productDetails,
        productCategory: !!productCategory,
        productMRP: !!productMRP
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!images || images.length === 0) {
      console.log('❌ No images provided');
      return NextResponse.json(
        { success: false, error: 'At least one product image is required' },
        { status: 400 }
      );
    }
    
    // Get the existing product to check if category is changing
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      console.log('❌ Product not found with ID:', id);
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Found existing product:', existingProduct.productName);
    
    const oldCategory = existingProduct.productCategory;
    const newCategory = productCategory.toLowerCase().trim();
    
    console.log('🔄 Category change check:', { oldCategory, newCategory });
    
    // Find or create the new product category
    if (newCategory !== oldCategory) {
      console.log('📂 Creating/finding new category:', newCategory);
      await ProductCategory.findOrCreate(productCategory, adminUser.id);
    }
    
    const updateData = {
      productName,
      description,
      productDetails,
      productCategory: newCategory,
      specifications: specifications || [],
      whatsInside: whatsInside || [],
      giftType: giftType || 'personalisedGift', // Use provided giftType or default to personalisedGift
      productMRP: parseFloat(productMRP),
      offerType: offerType || 'none',
      offerPercentage: parseFloat(offerPercentage) || 0,
      offerPrice: offerPrice ? parseFloat(offerPrice) : null,
      productType,
      images,
      tags: tags || [],
      colors: colors || [],
      isVisible: isVisible !== undefined ? isVisible : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      updatedAt: new Date()
    };
    
    // Only update productId if it's different from the existing one
    if (productId && productId !== existingProduct.productId) {
      updateData.productId = productId;
    }
    
    console.log('📝 Update data prepared:', updateData);
    
    // Update product without runValidators to avoid unique constraint issues
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    console.log('✅ Product updated:', updatedProduct ? 'Success' : 'Failed');
    
    // Update category counts if category changed
    if (newCategory !== oldCategory) {
      console.log('🔄 Updating category counts');
      // Decrement old category count
      if (oldCategory) {
        await ProductCategory.decrementProductCount(oldCategory);
      }
      // Increment new category count
      await ProductCategory.incrementProductCount(newCategory);
    }
    
    if (!updatedProduct) {
      console.log('❌ Product update failed - product not found');
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log('🎉 Product update successful');
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
    
  } catch (error) {
    console.error('💥 Error updating product:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update specific product fields (Admin only)
export async function PATCH(request, { params }) {
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
    
    // Only allow updating specific fields through PATCH
    const allowedFields = ['isVisible', 'isActive', 'isFeatured'];
    const updateData = {};
    
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    updateData.updatedAt = new Date();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
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
      { success: false, error: 'Failed to update product', details: error.message },
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
      { success: false, error: 'Failed to delete product', details: error.message },
      { status: 500 }
    );
  }
}
