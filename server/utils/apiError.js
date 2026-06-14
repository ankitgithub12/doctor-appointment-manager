/**
 * Custom API Error class.
 * Carries an HTTP status code so the error handler can respond appropriately.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
