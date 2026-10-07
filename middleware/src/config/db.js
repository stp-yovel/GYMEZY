import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(ENV.MONGODB_URI, {
      family: 4,
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`[DATABASE] Connected to MongoDB: ${connectionInstance.connection.host}/${connectionInstance.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DATABASE ERROR] MongoDB connection runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DATABASE WARN] MongoDB connection lost. Reconnecting...');
    });

    return connectionInstance;
  } catch (error) {
    console.error('[DATABASE ERROR] Failed to establish initial MongoDB connection:', error.message);
    process.exit(1);
  }
};
