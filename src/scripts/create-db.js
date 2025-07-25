import pkg from 'pg';
const { Client } = pkg;

const config = {
  user: 'admin',
  host: 'localhost',
  database: 'postgres',
  port: 5432,
};

const dbName = 'nodejs-basic';

async function recreateDatabase() {
  const client = new Client(config);
  try {
    await client.connect();
    const check = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    );
    if (check.rowCount > 0) {
      await client.query(`DROP DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' dropped.`);
    }
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database '${dbName}' created successfully!`);
  } catch (err) {
    console.error('Error (drop/create database):', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function createUsersTable() {
  const dbClient = new Client({
    ...config,
    database: dbName,
  });
  try {
    await dbClient.connect();
    await dbClient.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(100) NOT NULL,
        role VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "users" created successfully!');
  } catch (err) {
    console.error('Error creating users table:', err);
  } finally {
    await dbClient.end();
  }
}

async function main() {
  await recreateDatabase();
  await createUsersTable();
}

main();
