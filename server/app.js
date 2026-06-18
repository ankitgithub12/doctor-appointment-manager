/**
 * Express Application Configuration
 * All middleware, routes, and error handling is configured here.
 * server.js only handles HTTP server bootstrap.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';

import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import './config/firebase.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput, xssClean } from './middleware/sanitize.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import successStoryRoutes from './routes/successStoryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import specializationRoutes from './routes/specializationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Connect to Database
connectDB();

// Configure Cloudinary
configureCloudinary();

const app = express();

// ─── Security Middlewares ────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting
app.use(generalLimiter);

// ─── Body Parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Data Sanitization ──────────────────────────────────────────
app.use(sanitizeInput);
app.use(xssClean);

// HTTP Parameter Pollution protection
app.use(hpp());

// ─── Request Logger ──────────────────────────────────────────────
if ((process.env.NODE_ENV || 'development') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stories', successStoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HomeHub Homeopathy API is running...',
    version: '2.0.0',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// ─── Centralized Error Handler ───────────────────────────────────
app.use(errorHandler);

export default app;
