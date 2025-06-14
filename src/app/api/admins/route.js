import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';

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

// GET - Get all admins
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
    
    // Get all active admins
    const admins = await Admin.findActive().sort({ createdAt: -1 });
    
    // Return admins without sensitive data
    const safeAdmins = admins.map(admin => admin.toSafeObject());
    
    return NextResponse.json({
      admins: safeAdmins,
      currentAdmin: currentAdmin.toSafeObject()
    });
    
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new admin
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
    
    const { email, password, name, role = 'admin' } = await req.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!['admin', 'super-admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: email.toLowerCase().trim(),
      deletedAt: null
    });
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role,
      createdBy: currentAdmin._id
    });
    
    await newAdmin.save();
    
    return NextResponse.json({
      message: 'Admin created successfully',
      admin: newAdmin.toSafeObject()
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove admin (soft delete)
export async function DELETE(req) {
  try {
    await connectDB();
    
    const currentAdmin = await verifyAdminAuth(req);
    
    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get('id');
    
    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }
    
    // Prevent self-deletion
    if (adminId === currentAdmin._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
    
    // Find and soft delete admin
    const adminToDelete = await Admin.findOne({ 
      _id: adminId,
      isActive: true,
      deletedAt: null
    });
    
    if (!adminToDelete) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    // Perform soft delete
    const deletedAdmin = await Admin.softDelete(adminId);
    
    return NextResponse.json({
      message: 'Admin deleted successfully',
      deletedAdmin: {
        id: deletedAdmin._id.toString(),
        email: deletedAdmin.email,
        name: deletedAdmin.name
      }
    });
    
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
