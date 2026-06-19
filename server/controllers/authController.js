import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import { uploadAvatar, deleteFromCloudinary } from '../services/uploadService.js';
import { sendPasswordResetEmail } from '../services/mailService.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new AppError('User already exists with this email', 400);
  }

  const userRole = role || 'patient';

  // Create user (password is automatically hashed in Mongoose pre-save hook)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: userRole,
  });

  // If role is doctor, automatically create the linked Doctor document
  if (userRole === 'doctor') {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'MD';

    await Doctor.create({
      user: user._id,
      name: user.name,
      title: 'Consultant Doctor',
      qualification: 'BHMS / MD (Homeopathy)',
      experience: 1,
      initials,
      bio: `Dr. ${user.name} is a newly registered homeopathy consultant at HomeHub.`,
      email: user.email,
      phone: user.phone || '',
      isActive: true,
    });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// @desc    Login user with Firebase ID Token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check for user
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'address', 'dateOfBirth', 'gender', 'bloodGroup', 'emergencyContact'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Handle avatar upload
  if (req.file) {
    // Delete old avatar if exists
    const currentUser = await User.findById(req.user.id);
    if (currentUser.avatarPublicId) {
      await deleteFromCloudinary(currentUser.avatarPublicId);
    }

    const result = await uploadAvatar(req.file.buffer);
    updateData.avatar = result.url;
    updateData.avatarPublicId = result.publicId;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
    message: 'Profile updated successfully',
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    message: 'Password updated successfully',
  });
});

// @desc    Forgot Password - Send reset link via SendGrid
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('No user found with that email address', 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Save user with token
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const clientUrl = process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl, user.name);

    res.status(200).json({
      success: true,
      message: 'Reset link sent to email',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Forgot password error:', err);
    throw new AppError('Email could not be sent. Please try again later.', 500);
  }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError('Password is required', 400);
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Set new password in MongoDB (pre-save hook hashes it)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});
