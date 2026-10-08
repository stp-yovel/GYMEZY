import app from './src/app.js';
import { ENV } from './src/config/env.js';
import { connectDatabase } from './src/config/db.js';
import { initAttendanceCron } from './src/services/attendanceCron.service.js';

let server;

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await connectDatabase();
    initAttendanceCron();

    server = app.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`[SERVER] GYMEZY API Server running on port ${ENV.PORT} [0.0.0.0] [${ENV.NODE_ENV}]`);
      console.log(`[HEALTH] Health check: http://localhost:${ENV.PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('[SERVER ERROR] Server failed to start:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handler
const handleGracefulShutdown = (signal) => {
  console.log(`\n[SHUTDOWN] Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('[SHUTDOWN] Closed HTTP server connections.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();
