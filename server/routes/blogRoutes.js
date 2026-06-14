import express from 'express';
import {
  getBlogs, getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validate.js';
import { blogValidation } from '../validations/contactValidation.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, authorize('admin'), upload.single('coverImage'), blogValidation, validateRequest, createBlog);

router.get('/all', protect, authorize('admin'), getAllBlogs);

router.route('/:slug')
  .get(getBlog);

router.route('/id/:id')
  .put(protect, authorize('admin'), upload.single('coverImage'), updateBlog)
  .delete(protect, authorize('admin'), deleteBlog);

export default router;
