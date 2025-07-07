// routes/user.routes.js
import express from 'express';
const router = express.Router();

// Import controller functions
import { getAllUsers, getUserById, createUser } from '../controllers/user.controller.js';

// Định nghĩa các route sử dụng controller
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
