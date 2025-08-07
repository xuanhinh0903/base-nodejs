import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { passportAuthMiddleware } from '../middleware/passportAuthMiddleware.js';

const router = express.Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post(
  '/logout',
  passportAuthMiddleware.authenticate(),
  authController.logout.bind(authController),
);

export default router;
