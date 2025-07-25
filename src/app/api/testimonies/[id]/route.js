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

// PUT - Update testimony
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const currentAdmin = await verifyAdminAuth(req);
    
    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await req.json();
    
    // Find testimony
    const testimony = await Testimony.findOne({ 
      _id: id,
      deletedAt: null
    });
    
    if (!testimony) {
      return NextResponse.json(
        { error: 'Testimony not found' },
        { status: 404 }
      );
    }
    
    // Validate fields if provided
    if (body.customerName && !body.customerName.trim()) {
      return NextResponse.json(
        { error: 'Customer name cannot be empty' },
        { status: 400 }
      );
    }
    
    if (body.message && !body.message.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }
    
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Update testimony
    const updatedData = {};
    if (body.customerName !== undefined) updatedData.customerName = body.customerName.trim();
    if (body.customerImage !== undefined) updatedData.customerImage = body.customerImage?.trim() || null;
    if (body.rating !== undefined) updatedData.rating = body.rating;
    if (body.message !== undefined) updatedData.message = body.message.trim();
    if (body.product !== undefined) updatedData.product = body.product?.trim() || null;
    if (body.location !== undefined) updatedData.location = body.location?.trim() || null;
    if (body.isActive !== undefined) updatedData.isActive = body.isActive;
    updatedData.updatedAt = new Date();
    
    const updatedTestimony = await Testimony.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    
    return NextResponse.json({
      message: 'Testimony updated successfully',
      testimony: updatedTestimony
    });
    
  } catch (error) {
    console.error('Error updating testimony:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimony (soft delete)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const currentAdmin = await verifyAdminAuth(req);
    
    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Find testimony
    const testimony = await Testimony.findOne({ 
      _id: id,
      deletedAt: null
    });
    
    if (!testimony) {
      return NextResponse.json(
        { error: 'Testimony not found' },
        { status: 404 }
      );
    }
    
    // Soft delete
    await Testimony.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      isActive: false
    });
    
    return NextResponse.json({
      message: 'Testimony deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting testimony:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
