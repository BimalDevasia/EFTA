import { connectDB } from '@/lib/mongoose';
import Banner from '@/lib/models/banner';
import { NextResponse } from 'next/server';

// GET - Fetch all banners or specific banner by pageType
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const pageType = searchParams.get('pageType');
    
    let query = { isActive: true };
    if (pageType) {
      query.pageType = pageType;
    }
    
    const banners = await Banner.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      banners: pageType ? banners[0] || null : banners
    });
    
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update banner
export async function POST(req) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.image?.url || !data.pageType) {
      return NextResponse.json(
        { error: 'Title, image, and page type are required' },
        { status: 400 }
      );
    }

    // Always set buttonLink to /gifts
    data.buttonLink = '/gifts';
    
    // Check if banner for this pageType already exists
    const existingBanner = await Banner.findOne({ pageType: data.pageType });
    
    if (existingBanner) {
      // Update existing banner
      const updatedBanner = await Banner.findByIdAndUpdate(
        existingBanner._id,
        data,
        { new: true, runValidators: true }
      );
      
      return NextResponse.json({
        message: 'Banner updated successfully',
        banner: updatedBanner
      });
    } else {
      // Create new banner
      const banner = new Banner(data);
      const savedBanner = await banner.save();
      
      return NextResponse.json({
        message: 'Banner created successfully',
        banner: savedBanner
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error creating/updating banner:', error);
    
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

// DELETE - Delete banner by ID
export async function DELETE(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get('id');
    
    if (!bannerId) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }
    
    const deletedBanner = await Banner.findByIdAndDelete(bannerId);
    
    if (!deletedBanner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Banner deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
