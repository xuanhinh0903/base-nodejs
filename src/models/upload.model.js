import pool from '../utils/db.js';

// Model để lưu thông tin ảnh upload
class UploadModel {
  // Tạo bảng uploads nếu chưa có
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS uploads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        buffer_data BYTEA NOT NULL,
        user_id UUID REFERENCES users(id),
        description TEXT,
        tags TEXT[],
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await pool.query(createTableQuery);
      console.log('✅ Bảng uploads đã được tạo hoặc đã tồn tại');
    } catch (error) {
      console.error('❌ Lỗi tạo bảng uploads:', error);
      throw error;
    }
  }

  // Lưu ảnh mới
  static async saveImage(imageData) {
    const {
      id,
      originalName,
      mimeType,
      size,
      buffer,
      userId,
      description,
      tags,
      isPublic,
    } = imageData;

    const query = `
      INSERT INTO uploads (id, original_name, mime_type, size, buffer_data, user_id, description, tags, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      id,
      originalName,
      mimeType,
      size,
      buffer,
      userId,
      description,
      tags,
      isPublic,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Lỗi lưu ảnh:', error);
      throw error;
    }
  }

  // Lấy ảnh theo ID
  static async getImageById(imageId) {
    const query = `
      SELECT id, original_name, mime_type, size, buffer_data, user_id, description, tags, is_public, created_at
      FROM uploads 
      WHERE id = $1
    `;

    try {
      const result = await pool.query(query, [imageId]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh:', error);
      throw error;
    }
  }

  // Lấy tất cả ảnh của user
  static async getImagesByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, original_name, mime_type, size, user_id, description, tags, is_public, created_at
      FROM uploads 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh của user:', error);
      throw error;
    }
  }

  // Lấy tất cả ảnh public
  static async getPublicImages(limit = 20, offset = 0) {
    const query = `
      SELECT id, original_name, mime_type, size, user_id, description, tags, created_at
      FROM uploads 
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh public:', error);
      throw error;
    }
  }

  // Cập nhật thông tin ảnh
  static async updateImage(imageId, updateData) {
    const { description, tags, isPublic } = updateData;

    const query = `
      UPDATE uploads 
      SET description = $1, tags = $2, is_public = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        description,
        tags,
        isPublic,
        imageId,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Lỗi cập nhật ảnh:', error);
      throw error;
    }
  }

  // Xóa ảnh
  static async deleteImage(imageId, userId) {
    const query = `
      DELETE FROM uploads 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [imageId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Lỗi xóa ảnh:', error);
      throw error;
    }
  }

  // Tìm kiếm ảnh theo tags hoặc description
  static async searchImages(searchTerm, limit = 20, offset = 0) {
    const query = `
      SELECT id, original_name, mime_type, size, user_id, description, tags, created_at
      FROM uploads 
      WHERE is_public = true 
        AND (
          description ILIKE $1 
          OR EXISTS (
            SELECT 1 FROM unnest(tags) AS tag 
            WHERE tag ILIKE $1
          )
        )
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await pool.query(query, [
        `%${searchTerm}%`,
        limit,
        offset,
      ]);
      return result.rows;
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm ảnh:', error);
      throw error;
    }
  }

  // Đếm số ảnh của user
  static async countImagesByUserId(userId) {
    const query = `
      SELECT COUNT(*) as total
      FROM uploads 
      WHERE user_id = $1
    `;

    try {
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error('❌ Lỗi đếm ảnh:', error);
      throw error;
    }
  }
}

export default UploadModel;
