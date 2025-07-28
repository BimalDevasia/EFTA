import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ProductCategory from '@/lib/models/productCategory';
import Product from '@/lib/models/product';
import { verifyAdmin } from '@/lib/auth-helpers';

// GET - Fetch single category with details
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const category = await ProductCategory.findById(id)
      .populate('createdBy', 'name email')
      .lean();
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get sample products from this category
    const sampleProducts = await Product.find({ 
      productCategory: category.name 
    })
    .select('productName productMRP images')
    .limit(5)
    .lean();
    
    return NextResponse.json({
      success: true,
      category: {
        ...category,
        sampleProducts
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
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
    const { displayName, description, isActive } = body;
    
    if (!displayName) {
      return NextResponse.json(
        { success: false, error: 'Display name is required' },
        { status: 400 }
      );
    }
    
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      {
        displayName: displayName.trim(),
        description: description || '',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
    
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (soft delete)
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
    
    // Check if category has products
    const category = await ProductCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    if (category.productCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing products. Please move products to another category first.' },
        { status: 400 }
      );
    }
    
    // Soft delete (mark as inactive)
    await ProductCategory.findByIdAndUpdate(id, {
      isActive: false,
      updatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
