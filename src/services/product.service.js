import productModel from '../models/product.model.js';
import blockchainService from './blockchain.service.js';
import redisClient from '../config/redis.js';

class ProductService {
  /**
   * Get all products with smart caching strategy
   * Priority: Database cache -> Blockchain sync (if needed)
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} - Products with pagination
   */
  async getAllProducts(options = {}) {
    try {
      const { page = 1, limit = 10, search = '', category = '' } = options;

      // 1. Try Redis cache first (if available)
      if (redisClient.isConnected()) {
        const cacheKey = `products:page:${page}:limit:${limit}:search:${search}:category:${category}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
          console.log('🚀 Cache hit from Redis');
          const products = JSON.parse(cached);
          return {
            products,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(products.length / limit),
              totalProducts: products.length,
              limit,
              hasNextPage: page < Math.ceil(products.length / limit),
              hasPrevPage: page > 1,
              nextPage:
                page < Math.ceil(products.length / limit) ? page + 1 : null,
              prevPage: page > 1 ? page - 1 : null,
            },
          };
        }
      }

      // 2. Kiểm tra xem database có dữ liệu không
      const hasProducts = await productModel.hasProducts();

      // 3. Nếu database trống → sync từ blockchain
      if (!hasProducts) {
        console.log('📦 Database empty - syncing from blockchain...');
        await this.syncFromBlockchain();
      }

      // 4. Lấy dữ liệu từ database cache
      const result = await productModel.getAllProducts(options);

      // 5. Cache in Redis if available
      if (redisClient.isConnected()) {
        const cacheKey = `products:page:${page}:limit:${limit}:search:${search}:category:${category}`;
        await redisClient.setEx(cacheKey, 300, JSON.stringify(result.products)); // 5 minutes cache
      }

      return result;
    } catch (error) {
      console.error('❌ Error in getAllProducts:', error);
      throw error;
    }
  }

  /**
   * Get product by ID with smart caching strategy
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} - Product data or null
   */
  async getProductById(productId) {
    try {
      // 1. Try Redis cache first (if available)
      if (redisClient.isConnected()) {
        const cacheKey = `product:${productId}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
          console.log(`🚀 Cache hit from Redis for product ${productId}`);
          return JSON.parse(cached);
        }
      }

      // 2. Thử lấy từ database cache
      const cachedProduct = await productModel.getProductById(productId);

      if (cachedProduct) {
        // Cache in Redis if available
        if (redisClient.isConnected()) {
          const cacheKey = `product:${productId}`;
          await redisClient.setEx(cacheKey, 600, JSON.stringify(cachedProduct)); // 10 minutes cache
        }
        return cachedProduct;
      }

      // 3. Nếu không có trong cache → lấy từ blockchain và cache
      console.log(
        `📦 Product ${productId} not in cache - fetching from blockchain...`,
      );
      const blockchainProduct = await blockchainService.getProduct(productId);

      if (blockchainProduct) {
        // Cache product từ blockchain
        await this.cacheProduct(productId, blockchainProduct);
        const formattedProduct = this.formatProductForAPI(
          blockchainProduct,
          productId,
        );

        // Cache in Redis if available
        if (redisClient.isConnected()) {
          const cacheKey = `product:${productId}`;
          await redisClient.setEx(
            cacheKey,
            600,
            JSON.stringify(formattedProduct),
          ); // 10 minutes cache
        }

        return formattedProduct;
      }

      return null;
    } catch (error) {
      console.error('❌ Error in getProductById:', error);
      throw error;
    }
  }

  /**
   * Sync all products from blockchain to database cache
   * @returns {Promise<number>} - Number of synced products
   */
  async syncFromBlockchain() {
    try {
      console.log('🔄 Starting blockchain sync...');

      // 1. Lấy tất cả product IDs từ blockchain
      const productIds =
        await blockchainService.shopContract.getAllProductIds();

      if (productIds.length === 0) {
        console.log('📭 No products found in blockchain');
        return 0;
      }

      const productsToCache = [];

      // 2. Với mỗi product ID, lấy thông tin chi tiết từ blockchain
      for (const productId of productIds) {
        try {
          const product =
            await blockchainService.shopContract.getProduct(productId);
          const categoryName = await blockchainService.getCategoryName(
            product.category,
          );

          productsToCache.push({
            productId: productId.toString(),
            name: product.name,
            description: product.description,
            price: parseFloat(
              blockchainService.ethers.formatEther(product.price),
            ),
            imageUrl: product.imageUrl,
            category: categoryName,
            isAvailable: product.isAvailable,
            stock: Number(product.stock),
          });
        } catch (error) {
          console.error(`❌ Failed to fetch product ${productId}:`, error);
          continue;
        }
      }

      // 3. Sync vào database cache
      const syncedCount =
        await productModel.syncProductsFromBlockchain(productsToCache);
      console.log(`✅ Synced ${syncedCount} products from blockchain`);

      return syncedCount;
    } catch (error) {
      console.error('❌ Error in syncFromBlockchain:', error);
      throw error;
    }
  }

  /**
   * Cache a single product from blockchain
   * @param {string} productId - Product ID
   * @param {Object} blockchainProduct - Product data from blockchain
   */
  async cacheProduct(productId, blockchainProduct) {
    try {
      const categoryName = await blockchainService.getCategoryName(
        blockchainProduct.category,
      );

      const productData = {
        productId,
        name: blockchainProduct.name,
        description: blockchainProduct.description,
        price: parseFloat(blockchainProduct.price),
        imageUrl: blockchainProduct.imageUrl,
        category: categoryName,
        isAvailable: blockchainProduct.isAvailable,
        stock: Number(blockchainProduct.stock),
      };

      await productModel.upsertProduct(productData);
      console.log(`✅ Cached product ${productId}`);
    } catch (error) {
      console.error(`❌ Error caching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Add product to cache when added to blockchain
   * @param {Object} productData - New product data
   * @returns {Promise<Object>} - Cached product
   */
  async addProductToCache(productData) {
    try {
      const result = await productModel.upsertProduct(productData);
      console.log(`✅ Added product ${productData.productId} to cache`);

      // Clear Redis cache for products list
      if (redisClient.isConnected()) {
        await redisClient.del('products:*');
        console.log('🗑️  Cleared Redis cache for products list');
      }

      return result;
    } catch (error) {
      console.error('❌ Error adding product to cache:', error);
      throw error;
    }
  }

  /**
   * Remove product from cache when deleted from blockchain
   * @param {string} productId - Product ID to remove
   * @returns {Promise<boolean>} - Success status
   */
  async removeProductFromCache(productId) {
    try {
      const result = await productModel.deleteProduct(productId);
      console.log(`✅ Removed product ${productId} from cache`);

      // Clear Redis cache
      if (redisClient.isConnected()) {
        await redisClient.del(`product:${productId}`);
        await redisClient.del('products:*');
        console.log('🗑️  Cleared Redis cache for product and products list');
      }

      return result;
    } catch (error) {
      console.error(
        `❌ Error removing product ${productId} from cache:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update product stock in cache after purchase
   * @param {string} productId - Product ID
   * @param {number} newStock - New stock value
   */
  async updateProductStock(productId, newStock) {
    try {
      const product = await productModel.getProductById(productId);
      if (product) {
        await productModel.upsertProduct({
          ...product,
          stock: newStock,
        });
        console.log(`✅ Updated stock for product ${productId} to ${newStock}`);

        // Clear Redis cache for this product
        if (redisClient.isConnected()) {
          await redisClient.del(`product:${productId}`);
          console.log(`🗑️  Cleared Redis cache for product ${productId}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error updating stock for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Format blockchain product for API response
   * @param {Object} blockchainProduct - Raw blockchain product
   * @param {string} productId - Product ID
   * @returns {Object} - Formatted product for API
   */
  formatProductForAPI(blockchainProduct, productId) {
    return {
      productId,
      name: blockchainProduct.name,
      description: blockchainProduct.description,
      price: blockchainProduct.price,
      imageUrl: blockchainProduct.imageUrl,
      category: blockchainProduct.category,
      isAvailable: blockchainProduct.isAvailable,
      stock: Number(blockchainProduct.stock),
    };
  }
}

export default new ProductService();
