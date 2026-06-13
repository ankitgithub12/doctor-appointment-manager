import express from 'express';
import {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from '../controllers/successStoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSuccessStories)
  .post(protect, authorize('admin'), createSuccessStory);

router.route('/:id')
  .put(protect, authorize('admin'), updateSuccessStory)
  .delete(protect, authorize('admin'), deleteSuccessStory);

export default router;
