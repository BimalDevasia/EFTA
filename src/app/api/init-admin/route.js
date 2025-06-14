import { NextResponse } from 'next/server';
import { initializeDefaultAdmin } from '@/lib/initDefaultAdmin';

// POST - Initialize default admin (for development/setup)
export async function POST(req) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not allowed in production' },
        { status: 403 }
      );
    }
    
    await initializeDefaultAdmin();
    
    return NextResponse.json({
      message: 'Default admin initialized successfully',
      credentials: {
        email: 'bimaldevasia@gmail.com',
        password: '12345678'
      }
    });
    
  } catch (error) {
    console.error('Error initializing admin:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin: ' + error.message },
      { status: 500 }
    );
  }
}

// GET - Check admin status
export async function GET(req) {
  try {
    const { connectDB } = await import('@/lib/mongoose');
    const { default: Admin } = await import('@/lib/models/admin');
    
    await connectDB();
    
    const adminCount = await Admin.countDocuments({ isActive: true, deletedAt: null });
    const defaultAdmin = await Admin.findOne({ 
      email: 'bimaldevasia@gmail.com',
      isActive: true,
      deletedAt: null 
    });
    
    return NextResponse.json({
      totalActiveAdmins: adminCount,
      defaultAdminExists: !!defaultAdmin,
      message: adminCount === 0 ? 'No admins found. Use POST to initialize.' : 'Admins initialized.'
    });
    
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status: ' + error.message },
      { status: 500 }
    );
  }
}
