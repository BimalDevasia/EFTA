import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    
    if (connection.readyState === 1) {
      console.log('MongoDB connected successfully');
      return;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});