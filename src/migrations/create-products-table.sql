-- Create products table for caching blockchain data
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) UNIQUE NOT NULL, -- Blockchain product ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(20, 8) NOT NULL, -- Store price in ETH
    image_url TEXT,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Create full-text search index for name and description
CREATE INDEX IF NOT EXISTS idx_products_name_description ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Add comment for documentation
COMMENT ON TABLE products IS 'Cache table for blockchain products to improve API performance';
COMMENT ON COLUMN products.product_id IS 'Blockchain product ID (unique identifier)';
COMMENT ON COLUMN products.price IS 'Product price in ETH (decimal format)'; 