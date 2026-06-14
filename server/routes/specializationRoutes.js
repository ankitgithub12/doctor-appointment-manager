import express from 'express';
import {
  getSpecializations, getAllSpecializations,
  createSpecialization, updateSpecialization, deleteSpecialization,
} from '../controllers/specializationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSpecializations)
  .post(protect, authorize('admin'), createSpecialization);

router.get('/all', protect, authorize('admin'), getAllSpecializations);

router.route('/:id')
  .put(protect, authorize('admin'), updateSpecialization)
  .delete(protect, authorize('admin'), deleteSpecialization);

export default router;
