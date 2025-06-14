import { connectDB } from '@/lib/mongoose';
import Admin from '@/lib/models/admin';

export async function initializeDefaultAdmin() {
  try {
    await connectDB();
    await Admin.createDefaultAdmin();
  } catch (error) {
    console.error('Error initializing default admin:', error);
    throw error;
  }
}

// Don't auto-initialize to prevent blocking
// Only initialize when explicitly called
