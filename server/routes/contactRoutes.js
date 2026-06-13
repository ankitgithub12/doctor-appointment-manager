import express from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const contactValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('subject', 'Subject is required').notEmpty().trim(),
  body('message', 'Message is required').notEmpty().trim(),
  body('phone').optional().trim(),
];

router.route('/')
  .post(strictLimiter, contactValidation, validateRequest, createContact)
  .get(protect, authorize('admin'), getContacts);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteContact);

router.route('/:id/read')
  .patch(protect, authorize('admin'), markContactAsRead);

export default router;
