/**
 * Auth Validation Rules
 */
import { body } from 'express-validator';

export const registerValidation = [
  body('name', 'Name is required').notEmpty().trim().isLength({ min: 2, max: 50 }),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('firebaseToken', 'Firebase authentication token is required').notEmpty(),
  body('phone').optional().trim(),
  body('role').optional().isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
];

export const loginValidation = [
  body('firebaseToken', 'Firebase authentication token is required').notEmpty(),
];

export const loginLegacyValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
];

export const firebaseSyncValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
];

export const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('dateOfBirth').optional().isISO8601().toDate().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('bloodGroup').optional().trim(),
];

export const updatePasswordValidation = [
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
];
