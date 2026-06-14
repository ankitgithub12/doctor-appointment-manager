import express from 'express';
import {
  uploadDoctorPhotoHandler, uploadBlogCoverHandler,
  uploadAvatarHandler, deleteUpload,
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/doctor-photo', protect, authorize('admin'), upload.single('photo'), uploadDoctorPhotoHandler);
router.post('/blog-cover', protect, authorize('admin'), upload.single('cover'), uploadBlogCoverHandler);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatarHandler);
router.delete('/:publicId', protect, authorize('admin'), deleteUpload);

export default router;
