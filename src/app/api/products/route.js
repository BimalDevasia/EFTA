import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import { verifyAdmin } from '@/lib/auth-helpers';

// GET - Fetch products with optional category filter
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.productCategory = category;
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product (Admin only)
export async function POST(request) {
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
    
    // Create product
    const product = new Product({
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
      createdBy: adminUser.id
    });
    
    await product.save();
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
