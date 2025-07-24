import pool from '../utils/db.js';

class TransactionModel {
  /**
   * Get all transactions with pagination and filtering (following user model pattern)
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @param {string} options.wallet_address - Filter by wallet address
   * @param {string} options.type - Filter by transaction type
   * @param {string} options.status - Filter by transaction status
   * @param {string} options.product_id - Filter by product ID
   * @returns {Promise<Object>} Structured response with transactions and pagination
   */
  async getAllTransactions(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        wallet_address = '',
        type = '',
        status = '',
        product_id = '',
      } = options;

      const offset = (page - 1) * limit;

      let whereClause = '';
      const params = [];
      let paramIndex = 1;

      // Build WHERE clause based on filters
      const conditions = [];

      if (wallet_address && wallet_address.trim()) {
        conditions.push(`wallet_address = $${paramIndex}`);
        params.push(wallet_address.trim());
        paramIndex++;
      }

      if (type && type.trim()) {
        conditions.push(`type = $${paramIndex}`);
        params.push(type.trim());
        paramIndex++;
      }

      if (status && status.trim()) {
        conditions.push(`status = $${paramIndex}`);
        params.push(status.trim());
        paramIndex++;
      }

      if (product_id && product_id.trim()) {
        conditions.push(`product_id = $${paramIndex}`);
        params.push(product_id.trim());
        paramIndex++;
      }

      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
      }

      const transactionsQuery = `
        SELECT 
          id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at,
          COUNT(*) OVER() as total_count
        FROM transactions 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);
      const result = await pool.query(transactionsQuery, params);

      const total =
        result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        transactions: result.rows.map(row => {
          // eslint-disable-next-line no-unused-vars
          const { total_count, ...transaction } = row;
          return transaction;
        }),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get a single transaction by ID
   * @param {number} id - Transaction ID
   * @returns {Promise<Object|null>} Transaction object or null if not found
   */
  async getTransactionById(id) {
    try {
      const query = `
        SELECT id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at 
        FROM transactions 
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get a transaction by transaction hash
   * @param {string} txHash - Transaction hash
   * @returns {Promise<Object|null>} Transaction object or null if not found
   */
  async getTransactionByHash(txHash) {
    try {
      const query = `
        SELECT id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at 
        FROM transactions 
        WHERE tx_hash = $1
      `;
      const result = await pool.query(query, [txHash]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} transactionData.tx_hash - Ethereum transaction hash
   * @param {string} transactionData.type - Transaction type
   * @param {string} transactionData.wallet_address - Wallet address
   * @param {string} [transactionData.product_id] - Optional product ID
   * @param {string} [transactionData.status] - Transaction status (default: 'confirmed')
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(transactionData) {
    try {
      const {
        tx_hash,
        type,
        wallet_address,
        product_id = null,
        status = 'confirmed',
      } = transactionData;

      // Validate required fields
      if (!tx_hash || !type || !wallet_address) {
        throw new Error(
          'Missing required fields: tx_hash, type, wallet_address',
        );
      }

      // Validate transaction type
      const validTypes = ['add_product', 'delete_product', 'purchase_product'];
      if (!validTypes.includes(type)) {
        throw new Error(
          `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`,
        );
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'failed'];
      if (!validStatuses.includes(status)) {
        throw new Error(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        );
      }

      // Check if transaction hash already exists
      const existingTransaction = await this.getTransactionByHash(tx_hash);
      if (existingTransaction) {
        throw new Error('Transaction hash already exists');
      }

      const query = `
        INSERT INTO transactions (tx_hash, type, product_id, wallet_address, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at
      `;

      const params = [tx_hash, type, product_id, wallet_address, status];
      const result = await pool.query(query, params);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Update transaction status
   * @param {number} id - Transaction ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated transaction or null if not found
   */
  async updateTransactionStatus(id, status) {
    try {
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'failed'];
      if (!validStatuses.includes(status)) {
        throw new Error(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        );
      }

      const query = `
        UPDATE transactions 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at
      `;

      const result = await pool.query(query, [status, id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Delete a transaction (soft delete by setting status to 'failed')
   * @param {number} id - Transaction ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteTransaction(id) {
    try {
      const query = `
        UPDATE transactions 
        SET status = 'failed', updated_at = NOW()
        WHERE id = $1
        RETURNING id
      `;

      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get transaction statistics
   * @param {string} [wallet_address] - Optional wallet address filter
   * @returns {Promise<Object>} Transaction statistics
   */
  async getTransactionStats(wallet_address = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_transactions,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_transactions,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
          COUNT(CASE WHEN type = 'add_product' THEN 1 END) as add_product_count,
          COUNT(CASE WHEN type = 'delete_product' THEN 1 END) as delete_product_count,
          COUNT(CASE WHEN type = 'purchase_product' THEN 1 END) as purchase_product_count
        FROM transactions
      `;

      const params = [];
      if (wallet_address) {
        query += ' WHERE wallet_address = $1';
        params.push(wallet_address);
      }

      const result = await pool.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get transactions by wallet address with pagination
   * @param {string} wallet_address - Wallet address
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @returns {Promise<Object>} Structured response with transactions and pagination
   */
  async getTransactionsByWallet(wallet_address, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          id, tx_hash, type, product_id, wallet_address, status, created_at, updated_at,
          COUNT(*) OVER() as total_count
        FROM transactions 
        WHERE wallet_address = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const params = [wallet_address, limit, offset];
      const result = await pool.query(query, params);

      const total =
        result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        transactions: result.rows.map(row => {
          // eslint-disable-next-line no-unused-vars
          const { total_count, ...transaction } = row;
          return transaction;
        }),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default new TransactionModel();
