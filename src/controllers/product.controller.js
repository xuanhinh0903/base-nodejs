import { getProductsService } from '../services/product.service';
import { status } from 'http-status';

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    return res.status(200).json({
      message: 'Products fetched successfully',
      status: status['200_NAME'],
      data: products,
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
