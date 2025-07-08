// Base validation schemas - Common validation rules used across the application
import { query } from 'express-validator';

/**
 * Validation schema for pagination and search
 * @returns {Array} Array of validation rules for pagination
 */
export const validatePagination = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
];

/**
 * Middleware to check for unknown query parameters
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Function} Express middleware function
 */
export const validateAllowedFields = allowedFields => (req, res, next) => {
  const receivedFields = Object.keys(req.query);
  const unknownFields = receivedFields.filter(
    field => !allowedFields.includes(field),
  );

  if (unknownFields.length > 0) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      message: `Unknown fields: ${unknownFields.join(', ')}`,
      allowedFields: allowedFields,
    });
  }

  next();
};

/**
 * Complete pagination validation with field checking
 * @returns {Array} Array of validation rules including field checking
 */
export const validatePaginationStrict = () => [
  validateAllowedFields(['page', 'limit', 'search']),
  ...validatePagination(),
];
