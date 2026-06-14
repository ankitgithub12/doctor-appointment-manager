/**
 * Upload Service — Cloudinary integration
 * Handles image/file uploads to Cloudinary with folder organization.
 */
import { cloudinary } from '../config/cloudinary.js';

/**
 * Upload a buffer/base64 image to Cloudinary.
 * @param {Buffer|string} fileBuffer - The file buffer or base64 string
 * @param {string} folder - Cloudinary folder name
 * @param {object} options - Additional Cloudinary options
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'homehub', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `homehub/${folder}`,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by public_id.
 * @param {string} publicId
 * @returns {Promise<object>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Upload a doctor profile photo with optimized settings.
 */
export const uploadDoctorPhoto = (fileBuffer) => {
  return uploadToCloudinary(fileBuffer, 'doctors', {
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
    ],
  });
};

/**
 * Upload a blog cover image with optimized settings.
 */
export const uploadBlogCover = (fileBuffer) => {
  return uploadToCloudinary(fileBuffer, 'blogs', {
    transformation: [
      { width: 1200, height: 630, crop: 'fill' },
      { quality: 'auto:good' },
    ],
  });
};

/**
 * Upload user avatar.
 */
export const uploadAvatar = (fileBuffer) => {
  return uploadToCloudinary(fileBuffer, 'avatars', {
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
    ],
  });
};
