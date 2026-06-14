import { Specialization } from '../models/Specialization.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';

// @desc    Get all active specializations (public)
// @route   GET /api/specializations
// @access  Public
export const getSpecializations = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  const specializations = await Specialization.find(filter).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: specializations.length,
    data: specializations,
  });
});

// @desc    Get all specializations including inactive (admin)
// @route   GET /api/specializations/all
// @access  Private/Admin
export const getAllSpecializations = asyncHandler(async (req, res) => {
  const specializations = await Specialization.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    count: specializations.length,
    data: specializations,
  });
});

// @desc    Create specialization
// @route   POST /api/specializations
// @access  Private/Admin
export const createSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.create(req.body);
  res.status(201).json({ success: true, data: specialization });
});

// @desc    Update specialization
// @route   PUT /api/specializations/:id
// @access  Private/Admin
export const updateSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!specialization) {
    throw new AppError('Specialization not found', 404);
  }

  res.status(200).json({ success: true, data: specialization });
});

// @desc    Delete specialization
// @route   DELETE /api/specializations/:id
// @access  Private/Admin
export const deleteSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByIdAndDelete(req.params.id);

  if (!specialization) {
    throw new AppError('Specialization not found', 404);
  }

  res.status(200).json({ success: true, data: {} });
});
