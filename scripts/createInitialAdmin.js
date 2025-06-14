import { connectDB } from '@/lib/mongoose';
import User from '@/lib/models/user';

// Script to create the initial admin user
async function createInitialAdmin() {
  try {
    await connectDB();
    
    // Check if any users exist
    const existingUsers = await User.countDocuments();
    
    if (existingUsers > 0) {
      console.log('Users already exist in the database');
      return;
    }
    
    // Create initial admin user
    const initialAdmin = new User({
      name: 'Admin User',
      email: 'admin@efta.com',
      password: 'admin123', // This will be hashed automatically
      role: 'super_admin'
    });
    
    await initialAdmin.save();
    console.log('Initial admin user created successfully!');
    console.log('Email: admin@efta.com');
    console.log('Password: admin123');
    console.log('Please change this password after first login');
    
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
}

createInitialAdmin();
