/**
 * Multer middleware for file uploads.
 * Uses memory storage — files are buffered in RAM then sent to Cloudinary.
 */
import multer from 'multer';
import { UPLOAD_LIMITS } from '../utils/constants.js';
import AppError from '../utils/apiError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, and WebP images are allowed', 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE,
  },
});
