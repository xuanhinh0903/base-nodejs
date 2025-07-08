// User Routes - Route definitions with middleware
import express from 'express';
const router = express.Router();

// Import controller functions
import {
  getAllUsers,
  getUserById,
  createUser,
} from '../controllers/user.controller.js';

// Import middleware
import { validatePagination } from '../middleware/validation.middleware.js';

// Public routes (no authentication required)
router.post('/', createUser); // Register new user

// Protected routes (authentication required)
router.get(
  '/',
  validatePagination, // Validate pagination parameters
  getAllUsers // Get all users with pagination
);

router.get('/:id', getUserById); // Get user by ID

export default router;
