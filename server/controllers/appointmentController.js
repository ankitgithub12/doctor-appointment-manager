import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Public (Optionally Authenticated)
export const createAppointment = async (req, res, next) => {
  const { patientName, email, phone, preferredDate, preferredTime, healthConcern, doctor } = req.body;

  try {
    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointmentData = {
      patientName,
      email,
      phone,
      preferredDate,
      preferredTime,
      healthConcern,
      doctor,
      status: 'pending',
    };

    // If request has authenticated user, associate it
    if (req.user) {
      appointmentData.user = req.user.id;
    }

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment request submitted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name title')
      .sort({ preferredDate: 1, preferredTime: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in patient's appointments
// @route   GET /api/appointments/my
// @access  Private/Patient
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name title photo')
      .sort({ preferredDate: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res, next) => {
  const { status, notes } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: `Appointment not found with id of ${req.params.id}` });
    }

    // Only allow valid statuses
    if (status && !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Auth check: non-admins can only cancel their own appointments
    if (req.user.role !== 'admin') {
      if (!appointment.user || appointment.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ success: false, message: 'Patients can only cancel appointments' });
      }
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined && req.user.role === 'admin') updateFields.notes = notes;

    appointment = await Appointment.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('doctor', 'name title');

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment record
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: `Appointment not found with id of ${req.params.id}` });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
