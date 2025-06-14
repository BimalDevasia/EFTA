import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// GET - Check if setup is needed
export async function GET() {
  try {
    await connectDB();
    
    const adminCount = await Admin.countDocuments({ 
      isActive: true, 
      deletedAt: null 
    });
    
    const needsSetup = adminCount === 0;
    
    return NextResponse.json({
      needsSetup,
      message: needsSetup ? 'No admins found. Setup required.' : 'System already configured.'
    });
    
  } catch (error) {
    console.error('Error checking setup status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create first admin (only when no admins exist)
export async function POST(req) {
  try {
    await connectDB();
    
    // Check if any admins already exist
    const adminCount = await Admin.countDocuments({ 
      isActive: true, 
      deletedAt: null 
    });
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'System already has administrators. Use admin management to add more.' },
        { status: 400 }
      );
    }
    
    const { email, password, name } = await req.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password length (updated to match new requirement)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Create first admin with super-admin role
    const firstAdmin = new Admin({
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save hook
      name: name.trim(),
      role: 'super-admin'
    });
    
    await firstAdmin.save();
    
    // Create JWT token for immediate login
    const token = jwt.sign(
      { 
        adminId: firstAdmin._id.toString(),
        email: firstAdmin.email,
        role: firstAdmin.role,
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set HTTP-only cookie and return success
    const response = NextResponse.json({
      message: 'First administrator created successfully',
      user: {
        id: firstAdmin._id.toString(),
        email: firstAdmin.email,
        name: firstAdmin.name,
        role: firstAdmin.role
      }
    });
    
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
    
  } catch (error) {
    console.error('Error creating first admin:', error);
    
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
