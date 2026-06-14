import express from 'express';
import {
  register, login, getMe, updateProfile, updatePassword,
  forgotPassword, resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../middleware/upload.js';
import {
  registerValidation, loginValidation, updateProfileValidation,
  updatePasswordValidation, forgotPasswordValidation, resetPasswordValidation,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', strictLimiter, registerValidation, validateRequest, register);
router.post('/login', strictLimiter, loginValidation, validateRequest, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfileValidation, validateRequest, updateProfile);
router.put('/password', protect, updatePasswordValidation, validateRequest, updatePassword);
router.post('/forgot-password', strictLimiter, forgotPasswordValidation, validateRequest, forgotPassword);
router.put('/reset-password/:resetToken', resetPasswordValidation, validateRequest, resetPassword);

export default router;
