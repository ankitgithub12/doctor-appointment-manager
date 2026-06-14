/**
 * Pagination, Sorting & Filtering Utility
 * Builds Mongoose query options from request query params.
 *
 * Query params:
 *   ?page=1&limit=10&sort=-createdAt&search=keyword&fields=name,email
 */

export const getPaginationOptions = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  // Sort: comma-separated, prefix with - for descending
  // e.g., ?sort=-createdAt,name → { createdAt: -1, name: 1 }
  let sort = { createdAt: -1 }; // Default: newest first
  if (query.sort) {
    sort = {};
    query.sort.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  }

  // Field selection
  let select = null;
  if (query.fields) {
    select = query.fields.split(',').join(' ');
  }

  return { page, limit, skip, sort, select };
};

export const buildPaginationResult = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build a Mongoose filter object from query params.
 * Supports: search (text), status, isActive, date ranges.
 */
export const buildFilter = (query, searchFields = []) => {
  const filter = {};

  // Text search across multiple fields
  if (query.search && searchFields.length > 0) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = searchFields.map((field) => ({ [field]: searchRegex }));
  }

  // Status filter
  if (query.status) {
    filter.status = query.status;
  }

  // Active filter
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  // Date range
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  return filter;
};
