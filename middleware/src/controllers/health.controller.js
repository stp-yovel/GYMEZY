import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getHealthStatus = asyncHandler(async (_req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const healthData = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'healthy',
    database: {
      status: dbStateMap[mongoose.connection.readyState] || 'unknown',
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  };

  return res.status(200).json(ApiResponse.success(healthData, 'GYMEZY API is healthy'));
});
