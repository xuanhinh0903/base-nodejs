// User Routes - Route definitions with DTO validation middleware
import express from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
} from '../controllers/user.controller.js';

import {
  validateCreateUser,
  validateUserId,
} from '../validations/user.validation.js';

import { validatePagination } from '../validations/base.validation.js';

const router = express.Router();

// Get all users with pagination
router.get('/', validatePagination(), getAllUsers);

// Create new user
router.post('/', validateCreateUser(), createUser);

// Get user by ID
router.get('/:id', validateUserId(), getUserById);

export default router;
