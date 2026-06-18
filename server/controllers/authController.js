import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import admin from '../config/firebase.js';
import { uploadAvatar, deleteFromCloudinary } from '../services/uploadService.js';

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
  const { name, email, phone, role, firebaseToken } = req.body;

  if (!firebaseToken) {
    throw new AppError('Firebase authentication token is required', 400);
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(firebaseToken);
  } catch (fbError) {
    throw new AppError('Invalid Firebase authentication token', 401);
  }

  const { uid, email: fbEmail } = decodedToken;

  // Double check email matches
  if (fbEmail.toLowerCase() !== email.toLowerCase()) {
    throw new AppError('Email does not match authenticated token', 400);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new AppError('User already exists with this email', 400);
  }

  const userRole = role || 'patient';
  const randomPassword = crypto.randomBytes(16).toString('hex');

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: randomPassword,
    phone,
    role: userRole,
    firebaseUid: uid,
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
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    throw new AppError('Firebase authentication token is required', 400);
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(firebaseToken);
  } catch (fbError) {
    throw new AppError('Invalid Firebase authentication token', 401);
  }

  const { uid, email } = decodedToken;

  // Check for user
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('No user profile associated with this account', 404);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 401);
  }

  // Link firebaseUid if not stored
  if (!user.firebaseUid) {
    user.firebaseUid = uid;
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

// @desc    Legacy login for migrating existing users to Firebase
// @route   POST /api/auth/login-legacy
// @access  Public
export const loginLegacy = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

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

  // Link/Create in Firebase Auth
  try {
    const firebaseUser = await admin.auth().createUser({
      email: user.email,
      password: password,
      displayName: user.name,
    });
    user.firebaseUid = firebaseUser.uid;
  } catch (fbError) {
    if (fbError.code === 'auth/email-already-exists') {
      try {
        const fbUser = await admin.auth().getUserByEmail(user.email);
        user.firebaseUid = fbUser.uid;
      } catch (getFbError) {
        console.error('Failed to retrieve Firebase user during legacy login:', getFbError);
      }
    } else {
      console.error('Failed to create Firebase user during legacy login:', fbError);
    }
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

// @desc    Sync user to Firebase Auth on-the-fly during forgot password
// @route   POST /api/auth/firebase-sync
// @access  Public
export const firebaseSync = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('No user found with that email address', 404);
  }

  try {
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const firebaseUser = await admin.auth().createUser({
      email: user.email,
      password: randomPassword,
      displayName: user.name,
    });

    user.firebaseUid = firebaseUser.uid;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'User synchronized to Firebase successfully',
    });
  } catch (fbError) {
    if (fbError.code === 'auth/email-already-exists') {
      try {
        const fbUser = await admin.auth().getUserByEmail(user.email);
        user.firebaseUid = fbUser.uid;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
          success: true,
          message: 'User already exists in Firebase, database linked successfully',
        });
      } catch (getFbError) {
        throw new AppError('Failed to synchronize existing Firebase account', 500);
      }
    } else {
      console.error('Firebase sync error:', fbError);
      throw new AppError('Failed to synchronize account to Firebase', 500);
    }
  }
});
