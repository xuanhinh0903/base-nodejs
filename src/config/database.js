export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: null, // Tắt migration tracking
  },
  //   test: {
  //     username: 'your_db_user',
  //     password: 'your_db_password',
  //     database: 'your_test_db_name',
  //     host: '127.0.0.1',
  //     dialect: 'postgres',
  //   },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: null, // Tắt migration tracking
  },
};
