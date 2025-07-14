import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run products table migration
 * Creates the products table for caching blockchain data
 */
async function migrateProducts() {
  try {
    console.log('🔄 Starting products table migration...');

    // Read migration SQL file
    const migrationPath = path.join(
      __dirname,
      '../migrations/create-products-table.sql',
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Products table migration completed successfully!');
    console.log('📊 Table created: products');
    console.log('🔍 Indexes created for optimal performance');

    // Verify table creation
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'products'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table verification: products table exists');
    } else {
      console.log('❌ Table verification failed: products table not found');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProducts()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrateProducts;
