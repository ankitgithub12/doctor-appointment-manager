/**
 * Doctor Validation Rules
 */
import { body } from 'express-validator';

export const doctorValidation = [
  body('name', 'Doctor name is required').notEmpty().trim(),
  body('title', 'Title is required').notEmpty().trim(),
  body('qualification', 'Qualification is required').notEmpty().trim(),
  body('experience', 'Experience must be a number').isNumeric(),
  body('initials', 'Initials are required').notEmpty().trim(),
  body('bio', 'Biography is required').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('consultationFee').optional().isNumeric(),
  body('certifications').optional(),
  body('expertise').optional(),
];

export const updateDoctorValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('title').optional().trim(),
  body('qualification').optional().trim(),
  body('experience').optional().isNumeric(),
  body('initials').optional().trim(),
  body('bio').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('consultationFee').optional().isNumeric(),
  body('isActive').optional().isBoolean(),
];
