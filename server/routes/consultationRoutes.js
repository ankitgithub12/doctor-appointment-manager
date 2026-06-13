import express from 'express';
import { body } from 'express-validator';
import {
  createConsultation,
  getConsultations,
  updateConsultationStatus,
  deleteConsultation,
} from '../controllers/consultationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const consultationValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('phone', 'Phone number is required').notEmpty().trim(),
  body('healthConcern', 'Health concern is required').notEmpty().trim(),
];

router.route('/')
  .post(strictLimiter, consultationValidation, validateRequest, createConsultation)
  .get(protect, authorize('admin'), getConsultations);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteConsultation);

router.route('/:id/status')
  .patch(protect, authorize('admin'), updateConsultationStatus);

export default router;
