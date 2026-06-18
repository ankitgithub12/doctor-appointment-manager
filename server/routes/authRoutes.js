import express from 'express';
import {
  register, login, getMe, updateProfile, updatePassword,
  loginLegacy, firebaseSync,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../middleware/upload.js';
import {
  registerValidation, loginValidation, updateProfileValidation,
  updatePasswordValidation, loginLegacyValidation, firebaseSyncValidation,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', strictLimiter, registerValidation, validateRequest, register);
router.post('/login', strictLimiter, loginValidation, validateRequest, login);
router.post('/login-legacy', strictLimiter, loginLegacyValidation, validateRequest, loginLegacy);
router.post('/firebase-sync', strictLimiter, firebaseSyncValidation, validateRequest, firebaseSync);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfileValidation, validateRequest, updateProfile);
router.put('/password', protect, updatePasswordValidation, validateRequest, updatePassword);

export default router;
