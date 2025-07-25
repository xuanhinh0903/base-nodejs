import { Product } from '../repository/product.repo.js';

export const getProductsService = async () => {
  try {
    const products = await Product.findAll();
    return products || [];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};
