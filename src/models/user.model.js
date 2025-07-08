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
          id, name, email, created_at, updated_at,
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
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1';
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
      const { name, email } = userData;
      const query = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING id, name, email, created_at, updated_at
      `;
      const result = await pool.query(query, [name, email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default new UserModel();
