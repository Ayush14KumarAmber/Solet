import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/solet';
    
    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      console.log('⚠️  MongoDB URI not configured properly. Using local MongoDB...');
      const localUri = 'mongodb://localhost:27017/solet';
      await mongoose.connect(localUri);
      console.log('✅ MongoDB connected (local)');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without MongoDB. Frontend will use mock data.');
    // Don't exit - let the app continue with mock data
  }
}

