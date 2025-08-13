import { connectDB } from '@/lib/mongoose';
import Event from '@/lib/models/event';
import { NextResponse } from 'next/server';

// GET - Fetch all events with optional filters
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const eventCategory = searchParams.get('eventCategory');
    const search = searchParams.get('search');

    // Build query
    let query = {};
    
    if (eventCategory && eventCategory !== 'all') {
      query.eventCategory = eventCategory;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    // Fetch events
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Event.countDocuments(query);
    
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(req) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.eventName || !data.eventDescription) {
      return NextResponse.json(
        { error: 'Event name and description are required' },
        { status: 400 }
      );
    }

    // Validate event category
    if (!data.eventCategory || !['normal', 'corporate'].includes(data.eventCategory)) {
      return NextResponse.json(
        { error: 'Event category must be either "normal" or "corporate"' },
        { status: 400 }
      );
    }

    // Validate images
    if (!data.images || !Array.isArray(data.images) || data.images.length < 3 || data.images.length > 6) {
      return NextResponse.json(
        { error: 'Event must have between 3 and 6 images' },
        { status: 400 }
      );
    }

    // Validate each image has required fields
    for (const image of data.images) {
      if (!image.url || !image.public_id) {
        return NextResponse.json(
          { error: 'Each image must have url and public_id' },
          { status: 400 }
        );
      }
    }

    const event = new Event(data);
    const savedEvent = await event.save();
    
    return NextResponse.json({
      message: 'Event created successfully',
      event: savedEvent
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(error.errors).map(err => err.message).join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
