-- Remove the unnecessary image_path and image_url columns
-- Keep only bank_image field for simplicity

ALTER TABLE bank_info 
DROP COLUMN IF EXISTS image_path,
DROP COLUMN IF EXISTS image_url;

-- Verify the table structure
DESCRIBE bank_info;
