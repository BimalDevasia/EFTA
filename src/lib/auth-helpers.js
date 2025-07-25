import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Admin from '@/lib/models/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function verifyAdmin(request) {
  try {
    await connectDB();
    
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const admin = await Admin.findOne({ 
      _id: decoded.adminId,
      isActive: true,
      deletedAt: null
    }).select('-password');
    
    if (!admin) {
      return null;
    }
    
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function verifyAdminAuth(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get('admin-token')?.value;
    if (!token) {
      throw new Error('No authorization token provided');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const admin = await Admin.findOne({ 
      _id: decoded.adminId,
      isActive: true,
      deletedAt: null
    }).select('-password');
    
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    return admin;
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}
