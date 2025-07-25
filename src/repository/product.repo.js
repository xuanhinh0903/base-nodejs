import pool from '../utils/db.js';

export const Product = {
  findAll: async () => {
    const products = await pool.query('SELECT * FROM products');
    return products.rows;
  },

  findById: async productId => {
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [
      productId,
    ]);
    return product.rows[0];
  },

  create: async product => {
    const newProduct = await pool.query(
      'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
      [product.name, product.price],
    );
    return newProduct.rows[0];
  },
};
