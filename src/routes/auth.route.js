import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { createUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', createUser);

export default router;
