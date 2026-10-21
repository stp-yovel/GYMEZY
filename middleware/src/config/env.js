import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/gymezy_db',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_dev_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_EXPIRES_DAYS: Number.parseInt(process.env.COOKIE_EXPIRES_DAYS || '7', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
