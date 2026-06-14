/**
 * HTTP Server Bootstrap
 * Thin entry point — all Express config lives in app.js
 */
import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

// Validate required environment variables
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);
if (missingEnv.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please define these in a .env file.');
  process.exit(1);
}

// Import app after env is loaded
const { default: app } = await import('./app.js');

const PORT = parseInt(process.env.PORT || '5000', 10);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});
