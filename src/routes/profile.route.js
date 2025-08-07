import express from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { passportAuthMiddleware } from '../middleware/passportAuthMiddleware.js';

const router = express.Router();

router.get(
  '/me',
  passportAuthMiddleware.authenticate(),
  profileController.getProfile.bind(profileController),
);
router.put(
  '/me',
  passportAuthMiddleware.authenticate(),
  profileController.updateProfile.bind(profileController),
);
router.put(
  '/change-password',
  passportAuthMiddleware.authenticate(),
  profileController.changePassword.bind(profileController),
);

export default router;
