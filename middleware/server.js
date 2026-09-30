import app from './src/app.js';
import { ENV } from './src/config/env.js';
import { connectDatabase } from './src/config/db.js';

let server;

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(ENV.PORT, () => {
      console.log(`🚀 GYMEZY API Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
      console.log(`👉 Health check: http://localhost:${ENV.PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handler
const handleGracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('🔒 Closed HTTP server connections.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();
