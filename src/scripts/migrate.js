import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../utils/db.js';

/**
 * Migration script to create database tables
 * This script runs SQL migrations to set up the database schema
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and execute SQL migration file
const runMigration = async migrationFile => {
  try {
    console.log(`📄 Running migration: ${migrationFile}`);

    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'migrations', migrationFile);
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await pool.query(sqlContent);

    console.log(`✅ Migration completed: ${migrationFile}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`);
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

// Main migration function
const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');

    // List of migrations to run in order
    const migrations = [
      'create-users-table.sql',
      'add-password-column.sql',
      'create-table-category.sql',
    ];

    // Run each migration
    for (const migration of migrations) {
      await runMigration(migration);
    }

    console.log('🎉 All migrations completed successfully!');

    // Show table info
    const tableInfo = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Users table structure:');
    tableInfo.rows.forEach(row => {
      console.log(
        `   ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`,
      );
    });
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
};

// Run migrations
runMigrations();
