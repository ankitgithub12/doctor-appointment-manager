import { User } from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import { getPaginationOptions, buildPaginationResult, buildFilter } from '../utils/pagination.js';

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, select } = getPaginationOptions(req.query);
  const filter = buildFilter(req.query, ['name', 'email', 'phone']);

  // Add role filter
  if (req.query.role) {
    filter.role = req.query.role;
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select(select)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pagination = buildPaginationResult(page, limit, total);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(`User not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  // Prevent password update through this route
  const { password, ...updateData } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(`User not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(`User not found with id of ${req.params.id}`, 404);
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user.id) {
    throw new AppError('You cannot delete your own account from admin panel', 400);
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

// @desc    Toggle user active status (admin)
// @route   PATCH /api/users/:id/toggle-active
// @access  Private/Admin
export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(`User not found with id of ${req.params.id}`, 404);
  }

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
  });
});
