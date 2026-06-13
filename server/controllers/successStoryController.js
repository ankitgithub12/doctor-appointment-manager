import { SuccessStory } from '../models/SuccessStory.js';

// @desc    Get active success stories
// @route   GET /api/stories
// @access  Public
export const getSuccessStories = async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: stories.length, data: stories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new success story
// @route   POST /api/stories
// @access  Private/Admin
export const createSuccessStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.create(req.body);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

// @desc    Update success story
// @route   PUT /api/stories/:id
// @access  Private/Admin
export const updateSuccessStory = async (req, res, next) => {
  try {
    let story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: `Success story not found with id of ${req.params.id}` });
    }

    story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete success story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
export const deleteSuccessStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: `Success story not found with id of ${req.params.id}` });
    }

    await SuccessStory.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
