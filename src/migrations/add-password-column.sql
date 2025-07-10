-- Add password column to users table
-- This migration adds a password field for user authentication

-- Add password column
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add comment to password column
COMMENT ON COLUMN users.password IS 'Hashed password for user authentication';

-- Update existing users with a default password (if needed)
-- UPDATE users SET password = 'default_hashed_password' WHERE password IS NULL; 