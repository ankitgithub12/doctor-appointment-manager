import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import { uploadDoctorPhoto, uploadBlogCover, uploadAvatar, deleteFromCloudinary } from '../services/uploadService.js';

// @desc    Upload doctor photo
// @route   POST /api/upload/doctor-photo
// @access  Private/Admin
export const uploadDoctorPhotoHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a file', 400);
  }

  const result = await uploadDoctorPhoto(req.file.buffer);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Doctor photo uploaded successfully',
  });
});

// @desc    Upload blog cover image
// @route   POST /api/upload/blog-cover
// @access  Private/Admin
export const uploadBlogCoverHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a file', 400);
  }

  const result = await uploadBlogCover(req.file.buffer);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Blog cover uploaded successfully',
  });
});

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
export const uploadAvatarHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a file', 400);
  }

  const result = await uploadAvatar(req.file.buffer);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Avatar uploaded successfully',
  });
});

// @desc    Delete a file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteUpload = asyncHandler(async (req, res) => {
  const publicId = req.params.publicId;

  if (!publicId) {
    throw new AppError('Public ID is required', 400);
  }

  // Cloudinary public IDs use / separators which won't come through the URL
  // Client should send the full public ID as a query param instead
  const fullPublicId = req.query.id || publicId;

  await deleteFromCloudinary(fullPublicId);

  res.status(200).json({
    success: true,
    message: 'File deleted successfully',
  });
});
