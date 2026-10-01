import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(ENV.MONGODB_URI);
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
