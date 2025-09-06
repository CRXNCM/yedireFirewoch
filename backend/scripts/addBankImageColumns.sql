-- Add new image columns to bank_info table
ALTER TABLE bank_info 
ADD COLUMN IF NOT EXISTS image_path VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Update existing records to populate new fields
UPDATE bank_info 
SET image_path = CASE 
    WHEN bank_image LIKE '%supabase%' THEN CONCAT('banks/', SUBSTRING_INDEX(bank_image, '/', -1))
    WHEN bank_image LIKE '/uploads/%' THEN SUBSTRING(bank_image, 9)
    WHEN bank_image IS NOT NULL AND bank_image NOT LIKE 'http%' THEN CONCAT('banks/', bank_image)
    ELSE NULL
END,
image_url = CASE 
    WHEN bank_image LIKE 'http%' THEN bank_image
    WHEN bank_image LIKE '/uploads/%' THEN bank_image
    WHEN bank_image IS NOT NULL THEN CONCAT('/uploads/banks/', SUBSTRING_INDEX(bank_image, '/', -1))
    ELSE NULL
END
WHERE bank_image IS NOT NULL;
