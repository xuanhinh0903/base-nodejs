// Error Handler Utility
// Centralized error handling for controllers

/**
 * Handle errors from service layer and return appropriate HTTP response
 * @param {Error} error - The error object from service
 * @param {Object} res - Express response object
 * @param {string} operation - The operation being performed (for logging)
 */
export const handleServiceError = (error, res, operation = 'operation') => {
  console.error(`Error in ${operation}:`, error);

  // Handle validation errors from service
  if (error.message.includes('required') || error.message.includes('Invalid')) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: error.message,
    });
  }

  // Handle not found errors
  if (
    error.message.includes('not found') ||
    error.message.includes('Not Found')
  ) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: error.message,
    });
  }

  // Handle conflict errors (e.g., duplicate email)
  if (
    error.message.includes('already exists') ||
    error.message.includes('Conflict')
  ) {
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: error.message,
    });
  }

  // Handle unauthorized errors
  if (
    error.message.includes('unauthorized') ||
    error.message.includes('Unauthorized')
  ) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message,
    });
  }

  // Handle forbidden errors
  if (
    error.message.includes('forbidden') ||
    error.message.includes('Forbidden')
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: error.message,
    });
  }

  // Default internal server error
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
};

/**
 * Create a standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error type
 * @param {string} message - Error message
 */
export const sendErrorResponse = (res, statusCode, error, message) => {
  return res.status(statusCode).json({
    success: false,
    error,
    message,
  });
};
