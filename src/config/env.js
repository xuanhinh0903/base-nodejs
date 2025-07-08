import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export environment variables with fallback values
export const config = {
  PORT: process.env.PORT || 3000,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT || 5432,
};

// Also export individual variables for convenience
export const { PORT, DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = config;
