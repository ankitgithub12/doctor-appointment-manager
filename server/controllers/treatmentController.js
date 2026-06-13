import { Treatment } from '../models/Treatment.js';

// @desc    Get all active treatments
// @route   GET /api/treatments
// @access  Public
export const getTreatments = async (req, res, next) => {
  try {
    const treatments = await Treatment.find({ isActive: true });
    res.status(200).json({ success: true, count: treatments.length, data: treatments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single treatment by slug
// @route   GET /api/treatments/:slug
// @access  Public
export const getTreatmentBySlug = async (req, res, next) => {
  try {
    const treatment = await Treatment.findOne({ slug: req.params.slug, isActive: true });

    if (!treatment) {
      return res.status(404).json({ success: false, message: `Treatment profile not found for slug '${req.params.slug}'` });
    }

    res.status(200).json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new treatment profile
// @route   POST /api/treatments
// @access  Private/Admin
export const createTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.create(req.body);
    res.status(201).json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update treatment profile
// @route   PUT /api/treatments/:id
// @access  Private/Admin
export const updateTreatment = async (req, res, next) => {
  try {
    let treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ success: false, message: `Treatment not found with id of ${req.params.id}` });
    }

    treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete treatment profile
// @route   DELETE /api/treatments/:id
// @access  Private/Admin
export const deleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ success: false, message: `Treatment not found with id of ${req.params.id}` });
    }

    await Treatment.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
