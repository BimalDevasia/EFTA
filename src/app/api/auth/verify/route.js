import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// GET - Verify token and get admin info
export async function GET(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find active admin by ID
    const admin = await Admin.findOne({ 
      _id: decoded.adminId,
      isActive: true,
      deletedAt: null
    });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found or inactive' },
        { status: 401 }
      );
    }
    
    // Return admin user info
    return NextResponse.json({
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
