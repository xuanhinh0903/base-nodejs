import authRoutes from './auth.route.js';
import express from 'express';
import userRoutes from './user.route.js';

class Router {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    const defaultRoutes = [
      {
        path: '/users',
        route: userRoutes,
      },
    ]
    
    defaultRoutes.forEach((route) => {
      this.router.use(route.path, route.route);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new Router().getRouter();