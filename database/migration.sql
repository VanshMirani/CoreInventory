-- Quick DB Migration for OTP Reset
USE electrostock_db;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(6),
ADD COLUMN IF NOT EXISTS reset_expires DATETIME;

-- Verify
DESCRIBE users;

