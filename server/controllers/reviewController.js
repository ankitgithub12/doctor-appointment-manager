import { Review } from '../models/Review.js';

// @desc    Get approved reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews/all
// @access  Private/Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res, next) => {
  const { patientName, condition, rating, text, initials, videoUrl } = req.body;

  try {
    const review = await Review.create({
      patientName,
      condition,
      rating,
      text,
      initials,
      videoUrl,
      isApproved: false, // Moderated by default
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully! It will be live after admin moderation.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/moderate a review
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res, next) => {
  const { isApproved } = req.body;

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: `Review not found with id of ${req.params.id}` });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: isApproved !== undefined ? isApproved : true },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: `Review not found with id of ${req.params.id}` });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
