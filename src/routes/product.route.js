import express from 'express';
import {
  addProduct,
  getProduct,
  purchaseProduct,
  getNFT,
  getUserNFTs,
  getAllProducts,
} from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.get('/products/:productId', getProduct);
router.post('/products/:productId/purchase', purchaseProduct);
router.get('/nfts/:tokenId', getNFT);
router.get('/users/:userAddress/nfts', getUserNFTs);

export default router;
