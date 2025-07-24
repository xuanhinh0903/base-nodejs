import pool from '../utils/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file migration
const migrationPath = path.join(
  __dirname,
  '../migrations/create-uploads-table.sql',
);
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

async function migrateUploads() {
  try {
    console.log('🔄 Bắt đầu migration cho bảng uploads...');

    // Chạy migration
    await pool.query(migrationSQL);

    console.log('✅ Migration uploads thành công!');
    console.log('📋 Bảng uploads đã được tạo với các tính năng:');
    console.log('   - Lưu ảnh dưới dạng buffer (BYTEA)');
    console.log('   - Hỗ trợ tags và description');
    console.log('   - Trạng thái public/private');
    console.log('   - Index tối ưu cho truy vấn');
    console.log('   - Trigger tự động cập nhật updated_at');

    // Kiểm tra bảng đã được tạo
    const checkTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'uploads'
    `);

    if (checkTable.rows.length > 0) {
      console.log('✅ Bảng uploads đã tồn tại trong database');
    } else {
      console.log('❌ Bảng uploads chưa được tạo');
    }
  } catch (error) {
    console.error('❌ Lỗi migration uploads:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Chạy migration nếu file được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUploads()
    .then(() => {
      console.log('🎉 Migration hoàn thành!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration thất bại:', error);
      process.exit(1);
    });
}

export default migrateUploads;
