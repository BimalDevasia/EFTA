import { connectDB } from '@/lib/mongoose';
import Banner from '@/lib/models/banner';
import { NextResponse } from 'next/server';

// DELETE - Delete banner by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { bannerId } = params;
    
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
