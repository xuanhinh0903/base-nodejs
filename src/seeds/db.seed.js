import runMigrations from '../utils/migrations.js';
import seedUsers from './users.seed.js';

/**
 * Main function to run all database seeds
 */
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding process...');
    
    // First run migrations to ensure tables exist
    const migrationsSuccessful = await runMigrations();
    if (!migrationsSuccessful) {
      throw new Error('Migrations failed, cannot proceed with seeding');
    }
    
    // Seed users
    await seedUsers();
    
    // Add more seed functions here as needed
    // await seedOtherEntities();
    
    console.log('Database seeding completed successfully!');
    
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    return false;
  }
};

// Allow running directly with Node
if (process.argv[1].includes('db.seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Seeding error:', error);
      process.exit(1);
    });
}

export default seedDatabase; 