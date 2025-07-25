import express from 'express';
import { getProducts } from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getProducts);

export default router;
