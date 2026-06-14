/**
 * Standardized API Response Helper
 * Ensures consistent response format across all endpoints.
 */

export const sendSuccess = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode, message = 'Server Error') => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const sendPaginated = (res, statusCode, data, pagination, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    count: data.length,
    pagination,
    data,
  });
};
