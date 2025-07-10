import express from 'express';
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All profile routes require authentication
// Get current user profile
router.get('/me', authenticateToken, getCurrentUserProfile);

// Update current user profile
router.put('/me', authenticateToken, updateCurrentUserProfile);

export default router;
