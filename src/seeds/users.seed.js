import db from '../utils/db.js';

/**
 * @returns {Promise<void>}
 */
const seedUsers = async () => {
  try {
    const fakeUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123'
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: 'password123'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123'
      },
      {
        name: 'David Miller',
        email: 'david@example.com',
        password: 'password123'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: 'password123'
      },
      {
        name: 'Frank Thomas',
        email: 'frank@example.com',
        password: 'password123'
      },
      {
        name: 'Grace Davis',
        email: 'grace@example.com',
        password: 'password123'
      }
    ];

    for (const user of fakeUsers) {
      try {
        const checkResult = await db.query('SELECT email FROM users WHERE email = $1', [user.email]);
        
        if (checkResult.rowCount > 0) {
          console.log(`Skip user ${user.email}: Email already exists`);
          continue;
        }
        
        const result = await db.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
          [user.name, user.email, user.password]
        );
        
        console.log(`Create user: ${user.name} (${user.email}) with ID: ${result.rows[0].id}`);
      } catch (error) {
        console.log(`Error create user ${user.email}: ${error.message}`);
      }
    }

    console.log('Create users successfully');
  } catch (error) {
    console.error('Error create users:', error);
  }
};

export default seedUsers; 