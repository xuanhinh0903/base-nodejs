import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes - require authentication
// Get all users with pagination (requires authentication)
router.get('/', authenticateToken, getAllUsers);

// Get user by ID (requires authentication)
router.get('/:id', authenticateToken, getUserById);

export default router;
