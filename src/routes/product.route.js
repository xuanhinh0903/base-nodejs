import express from 'express';
import {
  addProduct,
  getProduct,
  purchaseProduct,
  getNFT,
  getUserNFTs,
  getAllProducts,
  deleteProductController,
} from '../controllers/shop.controller.js';

const router = express.Router();

// Product routes
router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.delete('/products/:productId', deleteProductController);
router.get('/products/:productId', getProduct);

// NFT routes
router.get('/nfts/:tokenId', getNFT);
router.get('/users/:userAddress/nfts', getUserNFTs);

// Purchase route
router.post('/products/:productId/purchase', purchaseProduct);

export default router;
