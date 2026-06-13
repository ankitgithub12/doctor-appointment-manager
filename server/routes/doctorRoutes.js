import express from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, authorize('admin'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

export default router;
