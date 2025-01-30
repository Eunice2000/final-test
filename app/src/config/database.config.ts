import mongoose from 'mongoose';
import { env } from './env.config';

export const connectDB = async () => {
 try {
  const connection = await mongoose.connect(env.mongodb.uri, {
   serverSelectionTimeoutMS: 5000,
   socketTimeoutMS: 45000,
  });

  return connection;
 } catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
 }
};
