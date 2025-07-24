import pool from '../utils/db.js';

class UserModel {
  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, search = '' } = options;

      const offset = (page - 1) * limit;

      let whereClause = '';
      let params = [];

      if (search && search.trim()) {
        whereClause = 'WHERE name ILIKE $1 OR email ILIKE $1';
        params = [`%${search.trim()}%`];
      }

      const usersQuery = `
        SELECT 
          id, name, email, wallet_address, created_at, updated_at,
          COUNT(*) OVER() as total_count
        FROM users 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;

      params.push(limit, offset);
      const result = await pool.query(usersQuery, params);

      const total =
        result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        users: result.rows.map(row => {
          // eslint-disable-next-line no-unused-vars
          const { total_count, ...user } = row;
          return user;
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
   * Get user by ID from database
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User data or null
   */
  async getUserById(id) {
    try {
      const query =
        'SELECT id, name, email, wallet_address, created_at, updated_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Create new user in database
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    try {
      const { name, email, password, wallet_address } = userData;
      const query = `
        INSERT INTO users (name, email, password, wallet_address)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, wallet_address, created_at, updated_at
      `;
      const result = await pool.query(query, [
        name,
        email,
        password,
        wallet_address,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get user by email from database (for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User data or null
   */
  async getUserByEmail(email) {
    try {
      const query =
        'SELECT id, name, email, password, wallet_address, created_at, updated_at FROM users WHERE email = $1';
      const result = await pool.query(query, [email.toLowerCase()]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Update user's wallet address
   * @param {number} userId - User ID
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Object>} - Updated user
   */
  async updateWalletAddress(userId, walletAddress) {
    try {
      const query = `
        UPDATE users 
        SET wallet_address = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, email, wallet_address, created_at, updated_at
      `;
      const result = await pool.query(query, [walletAddress, userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get user by wallet address
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Object|null>} - User data or null
   */
  async getUserByWalletAddress(walletAddress) {
    try {
      const query =
        'SELECT id, name, email, wallet_address, created_at, updated_at FROM users WHERE wallet_address = $1';
      const result = await pool.query(query, [walletAddress.toLowerCase()]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default new UserModel();
