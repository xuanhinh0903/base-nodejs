import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { userValidate } from '../validations/user.validate.js';

const router = express.Router();

router.post('/register', userValidate, register);

router.post('/login', login);

export default router;
