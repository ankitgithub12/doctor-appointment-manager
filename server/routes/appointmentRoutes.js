import express from 'express';
import { body } from 'express-validator';
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const appointmentValidation = [
  body('patientName', 'Patient name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('phone', 'Phone number is required').notEmpty().trim(),
  body('preferredDate', 'Preferred date is required').notEmpty().isISO8601().toDate(),
  body('preferredTime', 'Preferred time slot is required').notEmpty().trim(),
  body('healthConcern', 'Health concern description is required').notEmpty().trim(),
  body('doctor', 'Doctor ID is required and must be valid MongoDB ID').isMongoId(),
];

router.route('/')
  .post(strictLimiter, optionalProtect, appointmentValidation, validateRequest, createAppointment)
  .get(protect, authorize('admin'), getAppointments);

router.route('/my')
  .get(protect, getMyAppointments);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteAppointment);

router.route('/:id/status')
  .patch(protect, authorize('admin'), updateAppointmentStatus);

export default router;
