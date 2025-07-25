import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';
import Testimony from '@/lib/models/testimony';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Verify admin authentication
async function verifyAdminAuth(req) {
  const token = req.cookies.get('admin-token')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findOne({ 
      _id: decoded.adminId,
      isActive: true,
      deletedAt: null
    });
    return admin;
  } catch (error) {
    return null;
  }
}

// GET - Get all testimonies
export async function GET(req) {
  try {
    await connectDB();
    
    const currentAdmin = await verifyAdminAuth(req);
    
    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get all testimonies (both active and inactive for admin)
    const testimonies = await Testimony.find({ deletedAt: null })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      testimonies
    });
    
  } catch (error) {
    console.error('Error fetching testimonies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new testimony
export async function POST(req) {
  try {
    await connectDB();
    
    const currentAdmin = await verifyAdminAuth(req);
    
    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.customerName || !body.message) {
      return NextResponse.json(
        { error: 'Customer name and message are required' },
        { status: 400 }
      );
    }
    
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Create new testimony
    const testimony = new Testimony({
      customerName: body.customerName.trim(),
      customerImage: body.customerImage?.trim() || null,
      rating: body.rating || 5,
      message: body.message.trim(),
      product: body.product?.trim() || null,
      location: body.location?.trim() || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdBy: currentAdmin._id
    });
    
    await testimony.save();
    
    return NextResponse.json({
      message: 'Testimony created successfully',
      testimony
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating testimony:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
