import express from 'express';
import { passportAuthMiddleware } from '../middleware/passportAuthMiddleware.js';
import { getProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', passportAuthMiddleware.authenticate(), getProducts);

export default router;
