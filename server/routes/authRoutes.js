import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Input validation rules
const registerValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('phone').optional().trim(),
];

const loginValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
];

router.post('/register', strictLimiter, registerValidation, validateRequest, register);
router.post('/login', strictLimiter, loginValidation, validateRequest, login);
router.get('/me', protect, getMe);

export default router;
