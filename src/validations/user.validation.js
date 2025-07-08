// User validation schemas - Centralized validation rules for user operations
import { body, param } from 'express-validator';

/**
 * Validation schema for creating a new user
 * @returns {Array} Array of validation rules for user creation
 */
export const validateCreateUser = () => [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
];

/**
 * Validation schema for updating user information
 * @returns {Array} Array of validation rules for user updates
 */
export const validateUpdateUser = () => [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('Invalid user ID format'),

  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
];

/**
 * Validation schema for user ID parameter
 * @returns {Array} Array of validation rules for user ID
 */
export const validateUserId = () => [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('Invalid user ID format'),
];

/**
 * Validation schema for user login
 * @returns {Array} Array of validation rules for user login
 */
export const validateUserLogin = () => [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];
