CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,  -- SEO-friendly URL, e.g., "t-shirts"
    type_code INTEGER,         -- 1 = T-SHIRT, 2 = TOP, 3 = BOTTOM, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ghi chú cho cột
COMMENT ON COLUMN categories.slug IS 'Slug for SEO-friendly URL, e.g., "t-shirts"';
COMMENT ON COLUMN categories.type_code IS '1 = T-SHIRT, 2 = TOP, 3 = BOTTOM, etc.';

-- Index hỗ trợ tìm kiếm/sắp xếp
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
