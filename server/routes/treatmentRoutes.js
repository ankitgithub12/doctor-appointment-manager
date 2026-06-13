import express from 'express';
import {
  getTreatments,
  getTreatmentBySlug,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from '../controllers/treatmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTreatments)
  .post(protect, authorize('admin'), createTreatment);

router.route('/:slug')
  .get(getTreatmentBySlug);

router.route('/id/:id')
  .put(protect, authorize('admin'), updateTreatment)
  .delete(protect, authorize('admin'), deleteTreatment);

export default router;
