-- Tạo bảng uploads để lưu thông tin ảnh upload
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  buffer_data BYTEA NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_is_public ON uploads(is_public);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uploads_updated_at 
  BEFORE UPDATE ON uploads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Thêm comment cho bảng
COMMENT ON TABLE uploads IS 'Bảng lưu thông tin ảnh upload của users';
COMMENT ON COLUMN uploads.buffer_data IS 'Dữ liệu ảnh dưới dạng binary buffer';
COMMENT ON COLUMN uploads.tags IS 'Mảng các tag của ảnh';
COMMENT ON COLUMN uploads.is_public IS 'Trạng thái public/private của ảnh'; 