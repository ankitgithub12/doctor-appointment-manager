/**
 * Appointment Validation Rules
 */
import { body } from 'express-validator';

export const appointmentValidation = [
  body('patientName', 'Patient name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('phone', 'Phone number is required').notEmpty().trim(),
  body('preferredDate', 'Preferred date is required').notEmpty().isISO8601().toDate(),
  body('preferredTime', 'Preferred time slot is required').notEmpty().trim(),
  body('healthConcern', 'Health concern description is required').notEmpty().trim(),
  body('doctor', 'Doctor ID is required and must be valid MongoDB ID').isMongoId(),
  body('appointmentType').optional().isIn(['in-person', 'online', 'callback']).withMessage('Invalid appointment type'),
];

export const updateAppointmentValidation = [
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim(),
  body('prescription').optional().trim(),
  body('followUpDate').optional().isISO8601().toDate(),
];
