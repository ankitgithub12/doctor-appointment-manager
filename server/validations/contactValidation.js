/**
 * Contact Validation Rules
 */
import { body } from 'express-validator';

export const contactValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Valid email is required').isEmail().normalizeEmail(),
  body('subject', 'Subject is required').notEmpty().trim(),
  body('message', 'Message is required').notEmpty().trim(),
  body('phone').optional().trim(),
];

/**
 * Consultation Validation Rules
 */
export const consultationValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('phone', 'Phone number is required').notEmpty().trim(),
  body('healthConcern', 'Health concern is required').notEmpty().trim(),
];

/**
 * Blog Validation Rules
 */
export const blogValidation = [
  body('title', 'Title is required').notEmpty().trim(),
  body('content', 'Content is required').notEmpty(),
  body('excerpt').optional().trim(),
  body('category').optional().trim(),
  body('tags').optional(),
  body('isPublished').optional().isBoolean(),
];
