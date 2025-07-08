// Validation middleware for request data validation
import { query, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * This middleware checks for validation errors and returns them in a consistent format
 */
export const handleValidationErrors = (req, res, next) => {
  // Get validation errors from express-validator
  const errors = validationResult(req);

  // If there are validation errors, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  // If no errors, continue to next middleware
  next();
};

/**
 * Validation rules for pagination query parameters
 * Validates page and limit parameters for get all users
 */
export const validatePagination = [
  // Validate page parameter
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  // Validate limit parameter
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  // Validate search parameter
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search term must be between 1 and 50 characters'),

  // Handle validation errors
  handleValidationErrors,
];
