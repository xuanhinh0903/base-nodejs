import express from 'express';
import { getProfile } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

export default router;
