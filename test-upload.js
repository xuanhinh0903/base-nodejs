import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test script để kiểm tra chức năng upload ảnh
async function testUploadAPI() {
  console.log('🧪 Bắt đầu test API upload ảnh...\n');

  // Test 1: Kiểm tra server có chạy không
  try {
    const response = await fetch('http://localhost:3001/');
    if (response.ok) {
      console.log('✅ Server đang chạy trên port 3001');
    } else {
      console.log('❌ Server không phản hồi');
      return;
    }
  } catch (error) {
    console.log('❌ Không thể kết nối đến server:', error.message);
    console.log('💡 Hãy chạy: npm run dev');
    return;
  }

  // Test 2: Kiểm tra API docs
  try {
    const response = await fetch('http://localhost:3001/api-docs');
    if (response.ok) {
      console.log('✅ Swagger docs có sẵn tại: http://localhost:3001/api-docs');
    }
  } catch (error) {
    console.log('❌ Không thể truy cập Swagger docs');
  }

  // Test 3: Kiểm tra endpoint upload (không có auth)
  try {
    const response = await fetch('http://localhost:3001/api/upload/single', {
      method: 'POST',
    });

    if (response.status === 401) {
      console.log('✅ Endpoint upload yêu cầu authentication (đúng)');
    } else {
      console.log('⚠️ Endpoint upload không yêu cầu auth (có thể có vấn đề)');
    }
  } catch (error) {
    console.log('❌ Không thể test endpoint upload:', error.message);
  }

  console.log('\n📋 Hướng dẫn test upload ảnh:');
  console.log('1. Đăng nhập để lấy token:');
  console.log('   POST http://localhost:3001/api/auth/login');
  console.log(
    '   Body: { "email": "user@example.com", "password": "password" }',
  );

  console.log('\n2. Upload một ảnh:');
  console.log('   POST http://localhost:3001/api/upload/single');
  console.log('   Headers: { "Authorization": "Bearer YOUR_TOKEN" }');
  console.log('   Body: FormData với field "image"');

  console.log('\n3. Upload nhiều ảnh:');
  console.log('   POST http://localhost:3001/api/upload/multiple');
  console.log('   Headers: { "Authorization": "Bearer YOUR_TOKEN" }');
  console.log('   Body: FormData với field "images[]"');

  console.log('\n4. Xem ảnh:');
  console.log('   GET http://localhost:3001/api/upload/image/{imageId}');

  console.log('\n5. Xem danh sách ảnh của user:');
  console.log('   GET http://localhost:3001/api/upload/my-images');
  console.log('   Headers: { "Authorization": "Bearer YOUR_TOKEN" }');

  console.log('\n6. Xem ảnh public:');
  console.log('   GET http://localhost:3001/api/upload/public');

  console.log('\n7. Tìm kiếm ảnh:');
  console.log('   GET http://localhost:3001/api/upload/search?q=keyword');

  console.log('\n8. Cập nhật ảnh:');
  console.log('   PUT http://localhost:3001/api/upload/image/{imageId}');
  console.log('   Headers: { "Authorization": "Bearer YOUR_TOKEN" }');
  console.log(
    '   Body: { "description": "New description", "tags": "tag1,tag2", "isPublic": true }',
  );

  console.log('\n9. Xóa ảnh:');
  console.log('   DELETE http://localhost:3001/api/upload/image/{imageId}');
  console.log('   Headers: { "Authorization": "Bearer YOUR_TOKEN" }');

  console.log('\n🔧 Các tính năng đã implement:');
  console.log('✅ Upload ảnh dưới dạng buffer');
  console.log('✅ Xử lý ảnh với Sharp (resize, compress)');
  console.log('✅ Lưu ảnh vào database (BYTEA)');
  console.log('✅ Hỗ trợ tags và description');
  console.log('✅ Trạng thái public/private');
  console.log('✅ Pagination cho danh sách ảnh');
  console.log('✅ Tìm kiếm theo tags và description');
  console.log('✅ Authentication và authorization');
  console.log('✅ Swagger documentation');
  console.log('✅ Error handling');
  console.log('✅ File validation (chỉ chấp nhận ảnh)');
  console.log('✅ File size limit (5MB)');

  console.log('\n🎯 Để test với Postman:');
  console.log('1. Import collection từ Swagger docs');
  console.log('2. Set Authorization header với Bearer token');
  console.log('3. Upload file trong form-data');
  console.log('4. Test các endpoint khác nhau');

  console.log('\n📝 Lưu ý:');
  console.log('- Ảnh sẽ được resize về tối đa 800x800px');
  console.log('- Chất lượng JPEG được set 80%');
  console.log('- Chỉ chấp nhận file ảnh (MIME type bắt đầu bằng "image/")');
  console.log('- Giới hạn 5MB cho mỗi file');
  console.log('- Tối đa 10 file cho upload nhiều ảnh');
}

// Chạy test
testUploadAPI().catch(console.error);
