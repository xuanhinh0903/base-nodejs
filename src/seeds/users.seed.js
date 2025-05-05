import userService from '../servisces/user.service.js';

/**
 * Tạo dữ liệu người dùng mẫu
 * @returns {Promise<void>}
 */
const seedUsers = async () => {
  try {
    // Tạo một mảng dữ liệu người dùng giả
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

    // Thêm từng người dùng vào service
    for (const user of fakeUsers) {
      try {
        await userService.createUser(user);
        console.log(`Đã tạo user: ${user.name} (${user.email})`);
      } catch (error) {
        // Bỏ qua nếu email đã tồn tại
        console.log(`Bỏ qua user ${user.email}: ${error.message}`);
      }
    }

    console.log('Tạo dữ liệu người dùng giả thành công!');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu người dùng giả:', error);
  }
};

export default seedUsers; 