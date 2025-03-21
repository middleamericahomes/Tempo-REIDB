-- Fix the column names in the tags table
ALTER TABLE IF EXISTS tags
RENAME COLUMN tag_name TO name;

ALTER TABLE IF EXISTS tags
RENAME COLUMN tag_name_canonical TO name_canonical;

-- Fix the column names in the lists table for consistency
ALTER TABLE IF EXISTS lists
RENAME COLUMN list_name TO name;

ALTER TABLE IF EXISTS lists
RENAME COLUMN list_name_canonical TO name_canonical;
