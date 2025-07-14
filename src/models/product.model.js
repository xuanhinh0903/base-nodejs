import pool from '../utils/db.js';

class ProductModel {
  /**
   * Get all products with pagination from database cache
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} - Products with pagination info
   */
  async getAllProducts(options = {}) {
    try {
      const { page = 1, limit = 10, search = '', category = '' } = options;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      // Add search filter
      if (search && search.trim()) {
        whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search.trim()}%`);
        paramIndex++;
      }

      // Add category filter
      if (category && category.trim()) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category.trim());
        paramIndex++;
      }

      const productsQuery = `
        SELECT 
          product_id, name, description, price, image_url, category, 
          is_available, stock, created_at, updated_at,
          COUNT(*) OVER() as total_count
        FROM products 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);
      const result = await pool.query(productsQuery, params);

      const total =
        result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        products: result.rows.map(row => {
          // eslint-disable-next-line no-unused-vars
          const { total_count, ...product } = row;
          return {
            ...product,
            price: parseFloat(product.price),
            stock: parseInt(product.stock),
          };
        }),
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get product by ID from database cache
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} - Product data or null
   */
  async getProductById(productId) {
    try {
      const query = `
        SELECT product_id, name, description, price, image_url, category, 
               is_available, stock, created_at, updated_at
        FROM products 
        WHERE product_id = $1
      `;
      const result = await pool.query(query, [productId]);

      if (result.rows.length === 0) {
        return null;
      }

      const product = result.rows[0];
      return {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Create or update product in database cache
   * @param {Object} productData - Product data from blockchain
   * @returns {Promise<Object>} - Created/updated product
   */
  async upsertProduct(productData) {
    try {
      const {
        productId,
        name,
        description,
        price,
        imageUrl,
        category,
        isAvailable,
        stock,
      } = productData;

      const query = `
        INSERT INTO products (
          product_id, name, description, price, image_url, category, 
          is_available, stock, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT (product_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          image_url = EXCLUDED.image_url,
          category = EXCLUDED.category,
          is_available = EXCLUDED.is_available,
          stock = EXCLUDED.stock,
          updated_at = NOW()
        RETURNING *
      `;

      const result = await pool.query(query, [
        productId,
        name,
        description,
        price,
        imageUrl,
        category,
        isAvailable,
        stock,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Delete product from database cache
   * @param {string} productId - Product ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteProduct(productId) {
    try {
      const query = 'DELETE FROM products WHERE product_id = $1';
      const result = await pool.query(query, [productId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get total number of products
   * @returns {Promise<number>} - Total count
   */
  async getTotalProducts() {
    try {
      const query = 'SELECT COUNT(*) as total FROM products';
      const result = await pool.query(query);
      return parseInt(result.rows[0].total);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Sync all products from blockchain to database
   * @param {Array} blockchainProducts - Products from blockchain
   * @returns {Promise<number>} - Number of synced products
   */
  async syncProductsFromBlockchain(blockchainProducts) {
    try {
      let syncedCount = 0;

      for (const product of blockchainProducts) {
        await this.upsertProduct(product);
        syncedCount++;
      }

      return syncedCount;
    } catch (error) {
      throw new Error(`Sync error: ${error.message}`);
    }
  }

  /**
   * Check if database has any products
   * @returns {Promise<boolean>} - True if has products
   */
  async hasProducts() {
    try {
      const query = 'SELECT COUNT(*) as count FROM products LIMIT 1';
      const result = await pool.query(query);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default new ProductModel();
