import pool from '../utils/db.js';

/**
 * Seed script to populate database with sample category data
 * This script creates clothing categories with realistic names and slugs
 */

// Sample category data for clothing shop
const generateSampleCategories = () => {
  return [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      type_code: 1,
    },
    {
      name: 'Tops',
      slug: 'tops',
      type_code: 2,
    },
    {
      name: 'Bottoms',
      slug: 'bottoms',
      type_code: 3,
    },
    {
      name: 'Dresses',
      slug: 'dresses',
      type_code: 4,
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      type_code: 5,
    },
    {
      name: 'Activewear',
      slug: 'activewear',
      type_code: 6,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      type_code: 7,
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      type_code: 8,
    },
    {
      name: 'Underwear',
      slug: 'underwear',
      type_code: 9,
    },
    {
      name: 'Swimwear',
      slug: 'swimwear',
      type_code: 10,
    },
    {
      name: 'Formal Wear',
      slug: 'formal-wear',
      type_code: 11,
    },
    {
      name: 'Casual Wear',
      slug: 'casual-wear',
      type_code: 12,
    },
    {
      name: 'Vintage',
      slug: 'vintage',
      type_code: 13,
    },
    {
      name: 'Streetwear',
      slug: 'streetwear',
      type_code: 14,
    },
    {
      name: 'Luxury',
      slug: 'luxury',
      type_code: 15,
    },
  ];
};

// Main seed function
const seedCategories = async () => {
  try {
    console.log('🌱 Starting categories database seeding...');

    // Generate sample categories
    const sampleCategories = generateSampleCategories();
    console.log(`📝 Generated ${sampleCategories.length} sample categories`);

    // Check if categories table exists and has data
    const checkQuery = 'SELECT COUNT(*) as count FROM categories';
    const checkResult = await pool.query(checkQuery);
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} categories`);
      console.log('💡 To add more categories, run this script again');
      return;
    }

    // Insert sample categories
    console.log('📥 Inserting sample categories into database...');

    for (const category of sampleCategories) {
      const insertQuery = `
        INSERT INTO categories (name, slug, type_code)
        VALUES ($1, $2, $3)
        RETURNING id, name, slug, type_code, created_at
      `;

      await pool.query(insertQuery, [
        category.name,
        category.slug,
        category.type_code,
      ]);

      console.log(
        `✅ Created category: ${category.name} (${category.slug}) - Type: ${category.type_code}`,
      );
    }

    console.log('🎉 Categories database seeding completed successfully!');
    console.log(`📊 Total categories in database: ${sampleCategories.length}`);

    // Display summary of created categories
    console.log('\n📋 Categories created:');
    sampleCategories.forEach((category, index) => {
      console.log(
        `   ${index + 1}. ${category.name} (${category.slug}) - Type: ${category.type_code}`,
      );
    });
  } catch (error) {
    console.error('❌ Error during categories seeding:', error.message);

    // Provide helpful error messages
    if (error.message.includes('relation "categories" does not exist')) {
      console.log('💡 Make sure the categories table exists in your database');
      console.log('💡 You may need to run your database migrations first');
      console.log('💡 Run: npm run migrate or node src/scripts/migrate.js');
    }

    if (
      error.message.includes('duplicate key value violates unique constraint')
    ) {
      console.log('💡 Some categories already exist in the database');
      console.log('💡 Check for duplicate slugs or run with fresh database');
    }

    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
};

// Run the seed function
seedCategories();
