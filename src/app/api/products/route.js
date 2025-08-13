import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import ProductCategory from '@/lib/models/productCategory';
import EventCategory from '@/lib/models/eventCategory';
import { verifyAdmin } from '@/lib/auth-helpers';
import { formatProductTextCasing } from '@/utils/textFormatting';

// GET - Fetch products with optional category filter
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const eventCategory = searchParams.get('eventCategory');
    const giftType = searchParams.get('giftType');
    const productType = searchParams.get('productType');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const visible = searchParams.get('visible');
    const showHidden = searchParams.get('showHidden'); // Admin-only parameter
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;
    
    // Check if request is from admin by checking for admin parameter
    // This is a simple approach - in production you'd want proper JWT verification
    const isAdminRequest = searchParams.get('adminAccess') === 'true';
    
    let query = {};
    
    // SECURITY: Always filter by visibility for non-admin requests
    // Only show visible products to regular users
    if (!isAdminRequest) {
      query.isVisible = true;
      console.log('🔒 API: Non-admin request - filtering to visible products only');
    } else {
      console.log('👨‍💼 API: Admin request detected - can access all products');
      // Admin requests can specify visibility
      if (showHidden === 'true') {
        // Admin requesting hidden items only
        query.isVisible = false;
        console.log('👨‍💼 API: Admin requesting hidden products only');
      } else if (visible !== null && visible !== undefined) {
        // Admin with explicit visibility parameter
        query.isVisible = visible === 'true';
        console.log(`👨‍💼 API: Admin with explicit visibility: ${visible}`);
      } else {
        console.log('👨‍💼 API: Admin without visibility filter - showing all products');
      }
      // If no visibility parameter for admin, show all items (both visible and hidden)
    }
    
    // Handle event category filtering (new feature)
    if (eventCategory) {
      try {
        const eventCat = await EventCategory.findById(eventCategory);
        if (eventCat && eventCat.products && eventCat.products.length > 0) {
          query._id = { $in: eventCat.products };
          console.log(`🎉 API: Filtering by event category "${eventCat.title}" with ${eventCat.products.length} products`);
        } else {
          // If no products in event category, return empty results
          return NextResponse.json({
            products: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0
            }
          });
        }
      } catch (error) {
        console.error('Error fetching event category:', error);
        // Continue with normal filtering if event category fetch fails
      }
    }
    
    // Filter by giftType
    if (giftType && giftType !== 'all') {
      // Special handling for corporateGift to include both spellings
      if (giftType === 'corporateGift') {
        query.giftType = { $in: ['corporateGift', 'coperateGift'] };
      } else {
        query.giftType = giftType;
      }
    }
    
    // Filter by productType (customisable, heavyCustomisable, non-customisable)
    if (productType && productType !== 'all') {
      // Handle multiple productTypes (comma-separated)
      if (productType.includes(',')) {
        const productTypes = productType.split(',').map(type => type.trim());
        query.productType = { $in: productTypes };
      } else {
        query.productType = productType;
      }
    }
    
    // Filter by product category
    if (category && category !== 'all' && !giftType) {
      // If no giftType specified, treat category as giftType for backward compatibility
      if (category === 'corporate') {
        query.giftType = { $in: ['corporateGift', 'coperateGift'] };
      } else {
        query.giftType = category;
      }
    } else if (category && category !== 'all' && giftType) {
      // If both specified, use category as productCategory
      query.productCategory = category;
    }
    
    // Filter by featured status
    if (featured !== null && featured !== undefined) {
      query.isFeatured = featured === 'true';
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
    
    // Debug log the actual MongoDB query
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
      console.log('❌ Admin verification failed for product creation');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Admin verified for product creation:', adminUser.email);
    
    const rawBody = await request.json();
    console.log('📥 Raw body received for product creation:', rawBody);
    
    // Apply proper case formatting to the data
    const body = formatProductTextCasing(rawBody);
    console.log('📝 Formatted body for product creation:', body);
    
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
    
    console.log('📊 Extracted fields for product creation:', {
      productId,
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
      console.log('❌ Missing required fields for product creation:', {
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
      console.log('❌ No images provided for product creation');
      return NextResponse.json(
        { success: false, error: 'At least one product image is required' },
        { status: 400 }
      );
    }
    
    // Validate productId is provided and unique
    if (!productId || !productId.trim()) {
      console.log('❌ Product ID is required');
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if productId already exists
    const existingProduct = await Product.findOne({ productId: productId.toLowerCase().trim() });
    if (existingProduct) {
      console.log('❌ Product ID already exists:', productId);
      return NextResponse.json(
        { success: false, error: 'Product ID already exists' },
        { status: 400 }
      );
    }
    
    console.log('✅ Product ID is available:', productId);
    
    // Find or create the product category
    console.log('📂 Finding/creating product category:', productCategory);
    await ProductCategory.findOrCreate(productCategory, adminUser.id);
    
    // Create product
    console.log('🛠️ Creating new product...');
    const productData = {
      productId: productId.toLowerCase().trim(),
      productName,
      description,
      productDetails,
      productCategory: productCategory.toLowerCase().trim(),
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
      createdBy: adminUser.id
    };
    
    console.log('📝 Product data prepared:', productData);
    
    const product = new Product(productData);

    console.log('💾 Saving product to database...');
    await product.save();
    console.log('✅ Product saved successfully:', product._id);
    
    // Increment product count for the category
    console.log('🔢 Incrementing category count for:', productCategory);
    await ProductCategory.incrementProductCount(productCategory);
    
    console.log('🎉 Product creation completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
    
  } catch (error) {
    console.error('💥 Error creating product:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create product';
    if (error.code === 11000) {
      errorMessage = 'Product ID already exists';
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ');
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
