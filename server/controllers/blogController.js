import { Blog } from '../models/Blog.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/apiError.js';
import { getPaginationOptions, buildPaginationResult } from '../utils/pagination.js';
import { uploadBlogCover, deleteFromCloudinary } from '../services/uploadService.js';

// @desc    Get published blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = getPaginationOptions(req.query);

  const filter = { isPublished: true };

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Tag filter
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .populate('author', 'name avatar')
    .select('-content') // Don't send full content in list view
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pagination = buildPaginationResult(page, limit, total);

  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination,
    data: blogs,
  });
});

// @desc    Get all blogs including drafts (admin)
// @route   GET /api/blogs/all
// @access  Private/Admin
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = getPaginationOptions(req.query);

  const filter = {};
  if (req.query.isPublished !== undefined) {
    filter.isPublished = req.query.isPublished === 'true';
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .populate('author', 'name')
    .select('-content')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pagination = buildPaginationResult(page, limit, total);

  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination,
    data: blogs,
  });
});

// @desc    Get single blog by slug (public)
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
    .populate('author', 'name avatar');

  if (!blog) {
    throw new AppError('Blog post not found', 404);
  }

  // Increment view count
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, data: blog });
});

// @desc    Create blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;

  // Handle cover image upload
  if (req.file) {
    const result = await uploadBlogCover(req.file.buffer);
    req.body.coverImage = result.url;
    req.body.coverImagePublicId = result.publicId;
  }

  // Process tags from comma-separated string
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog,
    message: 'Blog post created successfully',
  });
});

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog post not found', 404);
  }

  // Handle cover image update
  if (req.file) {
    // Delete old image if exists
    if (blog.coverImagePublicId) {
      await deleteFromCloudinary(blog.coverImagePublicId);
    }
    const result = await uploadBlogCover(req.file.buffer);
    req.body.coverImage = result.url;
    req.body.coverImagePublicId = result.publicId;
  }

  // Process tags
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: blog });
});

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new AppError('Blog post not found', 404);
  }

  // Delete cover image from Cloudinary
  if (blog.coverImagePublicId) {
    await deleteFromCloudinary(blog.coverImagePublicId);
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
