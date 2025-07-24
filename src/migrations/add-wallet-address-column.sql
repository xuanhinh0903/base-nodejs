-- Add wallet_address column to users table
-- This migration adds a wallet_address field for blockchain integration

-- Add wallet_address column
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(42);

-- Add comment to wallet_address column
COMMENT ON COLUMN users.wallet_address IS 'User wallet address for blockchain transactions';

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Add unique constraint to wallet_address (optional - uncomment if needed)
-- ALTER TABLE users ADD CONSTRAINT unique_wallet_address UNIQUE (wallet_address); 