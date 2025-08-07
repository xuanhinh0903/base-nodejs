import pool from '../utils/db.js';
import PassportService from '../services/passport.service.js';

const passportService = new PassportService();

export const User = {
  findAll: async () => {
    try {
      const users = await pool.query('SELECT * FROM users');
      return users.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  findOne: async email => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      return user.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  findById: async userId => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [
        userId,
      ]);
      return user.rows[0];
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw error;
    }
  },

  create: async user => {
    try {
      const newUser = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          user.first_name,
          user.last_name,
          user.email,
          user.password,
          user.phone_number,
          user.role,
        ],
      );
      return newUser.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  login: async email => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      return user.rows[0];
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  accessToken: async userId => {
    try {
      // Sử dụng PassportService để tạo token thay vì jsonwebtoken trực tiếp
      const token = passportService.generateAccessToken(userId);
      return token;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw error;
    }
  },
};
