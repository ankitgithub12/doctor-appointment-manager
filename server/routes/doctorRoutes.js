import express from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, getDoctorAppointments, updateDoctorAvailability } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validate.js';
import { doctorValidation } from '../validations/doctorValidation.js';

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), upload.single('photo'), doctorValidation, validateRequest, createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, authorize('admin', 'doctor'), upload.single('photo'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

// Doctor-specific routes
router.get('/:id/appointments', protect, authorize('admin', 'doctor'), getDoctorAppointments);
router.put('/:id/availability', protect, authorize('admin', 'doctor'), updateDoctorAvailability);

export default router;
