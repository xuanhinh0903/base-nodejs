// import app from './app.js';
// import seedUsers from './seeds/users.seed.js';

// // Đảm bảo ứng dụng hoạt động ngay cả khi có lỗi không xử lý được
// process.on('uncaughtException', (error) => {
//   console.error('UNCAUGHT EXCEPTION! Shutting down...');
//   console.error(error.name, error.message, error.stack);
//   process.exit(1);
// });

// // Xử lý lỗi từ Promise không được catch
// process.on('unhandledRejection', (error) => {
//   console.error('UNHANDLED REJECTION! Shutting down...');
//   console.error(error.name, error.message, error.stack);
//   process.exit(1);
// });

// // Xử lý tín hiệu SIGTERM
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   process.exit(0);
// });

// // Tạo dữ liệu giả
// (async () => {
//   try {
//     // Chạy seed data
//     await seedUsers();
//   } catch (error) {
//     console.error('Lỗi khi tạo dữ liệu:', error);
//   }
// })();

// // Khởi động server được xử lý trong app.js
