import redisWrapper from '../config/redis.js';
import blockchainService from '../services/blockchain.service.js';
import productService from '../services/product.service.js';

// Load contracts khi khởi động
const NFT_ADDRESS = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44';
const SHOP_ADDRESS = '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f';

// Initialize blockchain service
await blockchainService.loadContracts(NFT_ADDRESS, SHOP_ADDRESS);

// Add product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !imageUrl || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await blockchainService.addProduct({
      name,
      description,
      price,
      imageUrl,
      category,
      stock: parseInt(stock),
    });

    // Add to cache after successful blockchain transaction
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to add product',
      });
    }
    const keys = await redisWrapper.keys('products:page:*');

    await Promise.all(keys.map(key => redisWrapper.del(key)));

    await productService.addProductToCache({
      productId: result.productId,
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      category,
      isAvailable: true,
      stock: parseInt(stock),
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message,
    });
  }
};

// Get product by ID
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message,
    });
  }
};

// Purchase product
export const purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;

    if (!productId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and price are required',
      });
    }

    const result = await blockchainService.purchaseProduct(
      productId,
      req.user.address,
      price,
    );

    // Update stock in cache after successful purchase
    if (result.success) {
      // Get current product to update stock
      const product = await productService.getProductById(productId);
      if (product && product.stock > 0) {
        await productService.updateProductStock(productId, product.stock - 1);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Product purchased successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error purchasing product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase product',
      error: error.message,
    });
  }
};

// Get NFT by token ID
export const getNFT = async (req, res) => {
  try {
    const { tokenId } = req.params;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: 'Token ID is required',
      });
    }

    const nft = await blockchainService.getNFT(tokenId);

    res.status(200).json({
      success: true,
      data: nft,
    });
  } catch (error) {
    console.error('Error getting NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT',
      error: error.message,
    });
  }
};

// Get user's NFTs
export const getUserNFTs = async (req, res) => {
  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        message: 'User address is required',
      });
    }

    const nfts = await blockchainService.getUserNFTs(userAddress);

    res.status(200).json({
      success: true,
      data: nfts,
    });
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user NFTs',
      error: error.message,
    });
  }
};

// Get all products with pagination (OPTIMIZED with caching)
export const getAllProducts = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid pagination parameters. Page must be >= 1, limit must be between 1-100',
      });
    }
    // Call to blockchain service
    // const offset = (page - 1) * limit;

    // const products = await blockchainService.getAllProducts(limit, offset);

    // Calculate pagination info
    // const totalProducts = await blockchainService.getTotalProducts();
    // const totalPages = Math.ceil(totalProducts / limit);
    // const hasNextPage = page < totalPages;
    // const hasPrevPage = page > 1;

    // res.status(200).json({
    //   success: true,
    //   data: products,
    //   pagination: {
    //     currentPage: page,
    //     totalPages,
    //     totalProducts,
    //     limit,
    //     hasNextPage,
    //     hasPrevPage,
    //     nextPage: hasNextPage ? page + 1 : null,
    //     prevPage: hasPrevPage ? page - 1 : null,
    //   },
    // });

    // Use product service with caching strategy
    const result = await productService.getAllProducts({
      page,
      limit,
      search,
      category,
    });

    // Cache in Redis if available
    if (redisWrapper.isConnected()) {
      const cacheKey = `products:page:${page}:limit:${limit}:search:${search}:category:${category}`;
      await redisWrapper.setEx(cacheKey, 300, JSON.stringify(result.products)); // 5 minutes cache
    }

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all products',
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const result = await blockchainService.deleteProductBlockchain(productId);

    // Remove from cache after successful blockchain transaction
    if (result.success) {
      const keys = await redisWrapper.keys('products:page:*');
      await productService.removeProductFromCache(productId);
      await Promise.all(keys.map(key => redisWrapper.del(key)));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
