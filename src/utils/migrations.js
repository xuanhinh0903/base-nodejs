import db from './db.js';

// Create users table if it doesn't exist
const createUsersTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created successfully or already exists');
    return true;
  } catch (error) {
    console.error('Error creating users table:', error);
    return false;
  }
};

// Run all migrations
const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await createUsersTable();
    console.log('All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
};

export default runMigrations; 