import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);
if (missingEnv.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please define these in a .env file.');
  process.exit(1);
}

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import successStoryRoutes from './routes/successStoryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// General Rate Limiter
app.use(generalLimiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (morgan)
if ((process.env.NODE_ENV || 'development') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stories', successStoryRoutes);
app.use('/api/stats', statsRoutes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HomeHub Homeopathy API is running...',
    version: '1.0.0',
  });
});

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
