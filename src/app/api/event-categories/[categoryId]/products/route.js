import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import EventCategory from '@/lib/models/eventCategory';
import Product from '@/lib/models/product';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { categoryId } = params;
    console.log('🔍 DEBUG - Event category products API called with categoryId:', categoryId);
    
    // Find the event category and populate its associated products
    const eventCategory = await EventCategory.findById(categoryId)
      .populate('products')
      .lean();
    
    console.log('🔍 DEBUG - Found event category:', eventCategory ? 'Yes' : 'No');
    console.log('🔍 DEBUG - Associated products count:', eventCategory?.products?.length || 0);
    
    if (!eventCategory) {
      console.log('🔍 DEBUG - Event category not found for ID:', categoryId);
      return NextResponse.json(
        { success: false, error: 'Event category not found' },
        { status: 404 }
      );
    }
    
    // Return the associated products in the same format as the main products API
    const response = {
      success: true,
      products: eventCategory.products || [],
      pagination: {
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false
      },
      total: eventCategory.products?.length || 0
    };
    
    console.log('🔍 DEBUG - API Response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('🔍 DEBUG - Error fetching event category products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event category products' },
      { status: 500 }
    );
  }
}
