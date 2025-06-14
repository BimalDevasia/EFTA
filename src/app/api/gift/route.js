import { connectDB } from '@/lib/mongoose';
import Gift from '@/lib/models/gift/gift';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Validate required images
    if (!data.images || data.images.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' },
        { status: 400 }
      );
    }
    
    // Calculate offer price
    const offerPrice = ((100 - data.offerPercentage) / 100) * data.productMRP;
    
    // Organize customization data
    const giftData = {
      ...data,
      offerPrice,
      customization: {
        customTextHeading: data.customTextHeading,
        numberOfCustomImages: data.numberOfCustomImages
      }
    };
    
    // Create new gift with calculated offer price
    const gift = new Gift(giftData);
    
    // Validate customization fields if product is customizable
    if (
      (data.productType === 'customisable' || data.productType === 'heavyCustomisable') &&
      (!data.customTextHeading || !data.numberOfCustomImages || data.numberOfCustomImages <= 0)
    ) {
      return NextResponse.json(
        { error: 'Customizable products require custom text heading and at least one custom image' },
        { status: 400 }
      );
    }
    
    // Save the gift to database
    const savedGift = await gift.save();
    
    return NextResponse.json(
      { message: 'Gift created successfully', gift: savedGift },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating gift:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(error.errors).map(err => err.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const query = {};
    
    // Handle search
    const search = searchParams.get('search');
    if (search) {
      query.$text = { $search: search };
    }
    
    // Handle category filter
    const category = searchParams.get('category');
    if (category) {
      query.productCategory = category;
    }
    
    // Handle product type filter
    const productType = searchParams.get('productType');
    if (productType) {
      query.productType = productType;
    }
    
    // Handle price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.offerPrice = {};
      if (minPrice) query.offerPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.offerPrice.$lte = parseFloat(maxPrice);
    }
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Gift.countDocuments(query);
    
    const gifts = await Gift.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      gifts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
    
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}