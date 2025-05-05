import express from 'express';
import userValidationSchema from '../validations/user.validation.js';

class AuthRouter {
  constructor() {
    this.router = express.Router();
  }

  initializeRoutes() {
    this.router.post('/register', userValidationSchema.CreateUserSchema);
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRouter().getRouter();