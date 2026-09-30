import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration supporting credentials (cookies)
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman) or matched allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Request body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Cookie parser for reading HTTP-only JWT cookies
app.use(cookieParser());

// Request logging in development
if (!ENV.IS_PRODUCTION) {
  app.use(morgan('dev'));
}

// Root welcome route
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'GYMEZY Backend Middleware API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Mount API v1 Routes
app.use('/api/v1', apiRouter);

// Catch-all 404 handler for undefined routes
app.use(notFound);

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
