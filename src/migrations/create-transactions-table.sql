-- Create transactions table for storing blockchain transaction data
-- This script creates the transactions table to track all blockchain operations

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    tx_hash VARCHAR(66) UNIQUE NOT NULL, -- Ethereum transaction hash (0x + 64 hex chars)
    type VARCHAR(50) NOT NULL, -- Transaction type: add_product, delete_product, purchase_product
    product_id VARCHAR(255), -- Optional reference to related product
    wallet_address VARCHAR(42) NOT NULL, -- Ethereum wallet address (0x + 40 hex chars)
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_type ON transactions(wallet_address, type);
CREATE INDEX IF NOT EXISTS idx_transactions_product_status ON transactions(product_id, status);

-- Add comments for documentation
COMMENT ON TABLE transactions IS 'Blockchain transaction tracking table for all shop operations';
COMMENT ON COLUMN transactions.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN transactions.tx_hash IS 'Unique Ethereum transaction hash (0x + 64 hex characters)';
COMMENT ON COLUMN transactions.type IS 'Transaction type: add_product, delete_product, purchase_product';
COMMENT ON COLUMN transactions.product_id IS 'Optional reference to the product involved in the transaction';
COMMENT ON COLUMN transactions.wallet_address IS 'Ethereum wallet address of the transaction sender (0x + 40 hex characters)';
COMMENT ON COLUMN transactions.status IS 'Transaction status: pending, confirmed, or failed (default: confirmed)';
COMMENT ON COLUMN transactions.created_at IS 'Timestamp when transaction record was created';
COMMENT ON COLUMN transactions.updated_at IS 'Timestamp when transaction record was last updated'; 