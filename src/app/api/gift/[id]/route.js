import { connectDB } from '@/lib/mongoose';
import Gift from '@/lib/models/gift/gift';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const gift = await Gift.findById(id);
    
    if (!gift) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      gift
    });
    
  } catch (error) {
    console.error('Error fetching gift:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
