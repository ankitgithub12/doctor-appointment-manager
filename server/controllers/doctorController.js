import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import { getPaginationOptions, buildPaginationResult, buildFilter } from '../utils/pagination.js';
import { uploadDoctorPhoto, deleteFromCloudinary } from '../services/uploadService.js';

// @desc    Get all active doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = getPaginationOptions(req.query);
  const filter = buildFilter(req.query, ['name', 'expertise', 'bio']);

  // By default only show active doctors for public
  if (!req.query.isActive) {
    filter.isActive = true;
  }

  // Specialization filter
  if (req.query.specialization) {
    filter.specializations = req.query.specialization;
  }

  const total = await Doctor.countDocuments(filter);
  const doctors = await Doctor.find(filter)
    .populate('specializations', 'name icon')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pagination = buildPaginationResult(page, limit, total);

  res.status(200).json({
    success: true,
    count: doctors.length,
    pagination,
    data: doctors,
  });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('specializations', 'name icon');

  if (!doctor) {
    throw new AppError(`Doctor not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: doctor });
});

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = asyncHandler(async (req, res) => {
  // Handle photo upload
  if (req.file) {
    const result = await uploadDoctorPhoto(req.file.buffer);
    req.body.photo = result.url;
    req.body.photoPublicId = result.publicId;
  }

  // Process array fields from comma-separated strings
  if (typeof req.body.certifications === 'string') {
    req.body.certifications = req.body.certifications.split(',').map(c => c.trim()).filter(Boolean);
  }
  if (typeof req.body.expertise === 'string') {
    req.body.expertise = req.body.expertise.split(',').map(e => e.trim()).filter(Boolean);
  }

  const doctor = await Doctor.create(req.body);

  res.status(201).json({ success: true, data: doctor });
});

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin or Doctor
export const updateDoctor = asyncHandler(async (req, res) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    throw new AppError(`Doctor not found with id of ${req.params.id}`, 404);
  }

  // Handle photo upload
  if (req.file) {
    if (doctor.photoPublicId) {
      await deleteFromCloudinary(doctor.photoPublicId);
    }
    const result = await uploadDoctorPhoto(req.file.buffer);
    req.body.photo = result.url;
    req.body.photoPublicId = result.publicId;
  }

  // Process array fields
  if (typeof req.body.certifications === 'string') {
    req.body.certifications = req.body.certifications.split(',').map(c => c.trim()).filter(Boolean);
  }
  if (typeof req.body.expertise === 'string') {
    req.body.expertise = req.body.expertise.split(',').map(e => e.trim()).filter(Boolean);
  }

  doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: doctor });
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    throw new AppError(`Doctor not found with id of ${req.params.id}`, 404);
  }

  // Delete photo from Cloudinary
  if (doctor.photoPublicId) {
    await deleteFromCloudinary(doctor.photoPublicId);
  }

  await Doctor.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get appointments for a specific doctor
// @route   GET /api/doctors/:id/appointments
// @access  Private/Admin or Doctor
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = getPaginationOptions(req.query);

  const filter = { doctor: req.params.id };
  if (req.query.status) filter.status = req.query.status;

  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate('user', 'name email phone')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pagination = buildPaginationResult(page, limit, total);

  res.status(200).json({
    success: true,
    count: appointments.length,
    pagination,
    data: appointments,
  });
});

// @desc    Update doctor availability schedule
// @route   PUT /api/doctors/:id/availability
// @access  Private/Admin or Doctor
export const updateDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    throw new AppError(`Doctor not found with id of ${req.params.id}`, 404);
  }

  doctor.availableSlots = req.body.availableSlots || [];
  await doctor.save();

  res.status(200).json({
    success: true,
    data: doctor,
    message: 'Availability updated successfully',
  });
});
