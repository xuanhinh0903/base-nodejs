import pool from '../utils/db.js';
import jwt from 'jsonwebtoken';

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

  create: async user => {
    try {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.name, user.email, user.password, user.phone, user.role],
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
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return token;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw error;
    }
  },
};
