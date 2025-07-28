const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const hashedPassword = await bcrypt.hash('123123123', 10);

    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: uuidv4(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: hashedPassword, // Password đã được hash: 123123123
          phone_number: '1234567890',
          role: 'user',
          created_at: new Date(),
        },
        {
          uuid: uuidv4(),
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          password: hashedPassword, // Password đã được hash: 123123123
          phone_number: '0987654321',
          role: 'admin',
          created_at: new Date(),
        },
        {
          uuid: uuidv4(),
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@example.com',
          password: hashedPassword, // Password đã được hash: 123123123
          phone_number: '5555555555',
          role: 'admin',
          created_at: new Date(),
        },
        {
          uuid: uuidv4(),
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password: hashedPassword, // Password đã được hash: 123123123
          phone_number: '1112223333',
          role: 'user',
          created_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
