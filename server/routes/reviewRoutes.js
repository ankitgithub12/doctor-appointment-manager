import express from 'express';
import { body } from 'express-validator';
import {
  getReviews,
  getAllReviews,
  createReview,
  approveReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const reviewValidation = [
  body('patientName', 'Name is required').notEmpty().trim(),
  body('condition', 'Condition treated is required').notEmpty().trim(),
  body('rating', 'Rating must be an integer between 1 and 5').isInt({ min: 1, max: 5 }),
  body('text', 'Review text is required').notEmpty().trim(),
  body('initials', 'Initials are required').notEmpty().trim(),
  body('videoUrl').optional().trim(),
];

router.route('/')
  .get(getReviews)
  .post(strictLimiter, optionalProtect, reviewValidation, validateRequest, createReview);

router.route('/my')
  .get(protect, getMyReviews);

router.route('/all')
  .get(protect, authorize('admin'), getAllReviews);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteReview);

router.route('/:id/approve')
  .patch(protect, authorize('admin'), approveReview);

export default router;
