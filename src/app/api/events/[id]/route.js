import { connectDB } from '@/lib/mongoose';
import Event from '@/lib/models/event';
import { NextResponse } from 'next/server';

// GET - Fetch single event by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(req, { params }) {
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

    // Validate images if provided
    if (data.images && (!Array.isArray(data.images) || data.images.length < 3 || data.images.length > 6)) {
      return NextResponse.json(
        { error: 'Event must have between 3 and 6 images' },
        { status: 400 }
      );
    }

    // Validate each image has required fields if images provided
    if (data.images) {
      for (const image of data.images) {
        if (!image.url || !image.public_id) {
          return NextResponse.json(
            { error: 'Each image must have url and public_id' },
            { status: 400 }
          );
        }
      }
    }

    const event = await Event.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Event updated successfully',
      event
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    
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

// DELETE - Delete event
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const event = await Event.findByIdAndDelete(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Event deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
