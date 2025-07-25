import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Testimony from '@/lib/models/testimony';

// GET - Get active testimonies for public display
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const rating = searchParams.get('rating');
    const random = searchParams.get('random') === 'true';
    
    let query = Testimony.findActive();
    
    // Filter by rating if specified
    if (rating && !isNaN(parseInt(rating))) {
      query = query.where('rating').equals(parseInt(rating));
    }
    
    // Apply limit
    query = query.limit(limit);
    
    let testimonies;
    
    if (random) {
      // Get random testimonies
      testimonies = await Testimony.aggregate([
        { $match: { isActive: true, deletedAt: null } },
        { $sample: { size: limit } }
      ]);
    } else {
      // Get latest testimonies
      testimonies = await query.sort({ createdAt: -1 });
    }
    
    // Return safe objects (without sensitive data)
    const safeTestimonies = testimonies.map(testimony => {
      if (testimony.toSafeObject) {
        return testimony.toSafeObject();
      } else {
        // For aggregation results
        const { createdBy, deletedAt, __v, ...safeObj } = testimony;
        return safeObj;
      }
    });
    
    return NextResponse.json({
      testimonies: safeTestimonies,
      count: safeTestimonies.length
    });
    
  } catch (error) {
    console.error('Error fetching public testimonies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
