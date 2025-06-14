import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';
import { initializeDefaultAdmin } from '@/lib/initDefaultAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// POST - Admin login with database authentication
export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if any admin exists, if not, initialize default admin
    const adminCount = await Admin.countDocuments({ isActive: true, deletedAt: null });
    if (adminCount === 0) {
      console.log('No active admins found, initializing default admin...');
      await initializeDefaultAdmin();
    }
    
    // Find active admin by email
    const admin = await Admin.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true,
      deletedAt: null
    });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
