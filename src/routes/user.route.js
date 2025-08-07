import express from 'express';
import { passportAuthMiddleware } from '../middleware/passportAuthMiddleware.js';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/',
  passportAuthMiddleware.authenticate(),
  userController.getUsers.bind(userController),
);
router.get(
  '/:id',
  passportAuthMiddleware.authenticate(),
  userController.getUserById.bind(userController),
);
router.post(
  '/',
  passportAuthMiddleware.authenticate(),
  userController.createUser.bind(userController),
);
router.put(
  '/:id',
  passportAuthMiddleware.authenticate(),
  userController.updateUser.bind(userController),
);
router.delete(
  '/:id',
  passportAuthMiddleware.authenticate(),
  userController.deleteUser.bind(userController),
);

export default router;
