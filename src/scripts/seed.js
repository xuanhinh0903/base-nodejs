import { faker } from '@faker-js/faker';
import pool from '../utils/db.js';

/**
 * Seed script to populate database with sample user data
 * This script creates 20 sample users with realistic names and emails
 */

// Sample user data generator
const generateSampleUsers = (count = 20) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });

    users.push({ name, email });
  }

  return users;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Generate sample users
    const sampleUsers = generateSampleUsers(20);
    console.log(`📝 Generated ${sampleUsers.length} sample users`);

    // Check if users table exists and has data
    const checkQuery = 'SELECT COUNT(*) as count FROM users';
    const checkResult = await pool.query(checkQuery);
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} users`);
      console.log('💡 To add more users, run this script again');
      return;
    }

    // Insert sample users
    console.log('📥 Inserting sample users into database...');

    for (const user of sampleUsers) {
      const insertQuery = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING id, name, email, created_at
      `;

      const result = await pool.query(insertQuery, [user.name, user.email]);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Total users in database: ${sampleUsers.length}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);

    // Provide helpful error messages
    if (error.message.includes('relation "users" does not exist')) {
      console.log('💡 Make sure the users table exists in your database');
      console.log('💡 You may need to run your database migrations first');
    }

    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
};

// Run the seed function
seedDatabase();
