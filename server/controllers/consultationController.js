import { Consultation } from '../models/Consultation.js';

// @desc    Request a free callback consultation
// @route   POST /api/consultations
// @access  Public
export const createConsultation = async (req, res, next) => {
  const { name, phone, healthConcern } = req.body;

  try {
    const consultation = await Consultation.create({
      name,
      phone,
      healthConcern,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      data: consultation,
      message: 'Consultation callback requested successfully! We will contact you soon.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultation requests
// @route   GET /api/consultations
// @access  Private/Admin
export const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status
// @route   PATCH /api/consultations/:id/status
// @access  Private/Admin
export const updateConsultationStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    let consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: `Consultation request not found with id of ${req.params.id}` });
    }

    if (status && !['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete consultation request
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
export const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: `Consultation request not found with id of ${req.params.id}` });
    }

    await Consultation.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
