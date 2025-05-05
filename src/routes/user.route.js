import express from 'express';
import userController from '../controllers/user.controller.js';
import userValidationSchema from '../validations/user.validation.js';
import validate from '../middlewares/validate.js';

class UserRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // GET /users - Get list of users
    this.router.get(
      '/',
      validate(userValidationSchema.GetUsersSchema),
      userController.getUsers
    );

    // POST /users - Create a new user
    this.router.post(
      '/',
      validate(userValidationSchema.CreateUserSchema),
      userController.createUser
    );

    // GET /users/:id - Get a user's information
    this.router.get(
      '/:id',
      validate(userValidationSchema.GetUserByIdSchema),
      userController.getUserById
    );

    // PUT /users/:id - Update user information
    this.router.put(
      '/:id',
      validate(userValidationSchema.UpdateUserSchema),
      userController.updateUser
    );

    // DELETE /users/:id - Delete a user
    this.router.delete(
      '/:id',
      validate(userValidationSchema.DeleteUserSchema),
      userController.deleteUser
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRouter().getRouter(); 