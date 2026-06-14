/**
 * Review Validation Rules
 */
import { body } from 'express-validator';

export const reviewValidation = [
  body('patientName', 'Name is required').notEmpty().trim(),
  body('condition', 'Condition treated is required').notEmpty().trim(),
  body('rating', 'Rating must be an integer between 1 and 5').isInt({ min: 1, max: 5 }),
  body('text', 'Review text is required').notEmpty().trim(),
  body('initials', 'Initials are required').notEmpty().trim(),
  body('videoUrl').optional().trim(),
  body('doctor').optional().isMongoId().withMessage('Invalid doctor ID'),
];
