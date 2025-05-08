import 'dotenv/config';

import pg from 'pg';

const { Pool } = pg;

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
}; 