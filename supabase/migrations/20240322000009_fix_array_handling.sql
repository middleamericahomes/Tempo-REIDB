-- Fix array handling for all array fields
-- This ensures that array fields can handle both scalar and array values

-- Update the properties table to ensure all array fields are properly handled
ALTER TABLE properties
  ALTER COLUMN tags TYPE JSONB USING CASE 
    WHEN tags IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(tags) = 'string' THEN jsonb_build_array(tags)
    ELSE tags
  END,
  ALTER COLUMN lists TYPE JSONB USING CASE 
    WHEN lists IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(lists) = 'string' THEN jsonb_build_array(lists)
    ELSE lists
  END,
  ALTER COLUMN list_stack TYPE JSONB USING CASE 
    WHEN list_stack IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(list_stack) = 'string' THEN jsonb_build_array(list_stack)
    ELSE list_stack
  END;

-- Update all phone_tags fields to ensure they are properly handled
ALTER TABLE properties
  ALTER COLUMN phone_tags_1 TYPE JSONB USING CASE 
    WHEN phone_tags_1 IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(phone_tags_1) = 'string' THEN jsonb_build_array(phone_tags_1)
    ELSE phone_tags_1
  END,
  ALTER COLUMN phone_tags_2 TYPE JSONB USING CASE 
    WHEN phone_tags_2 IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(phone_tags_2) = 'string' THEN jsonb_build_array(phone_tags_2)
    ELSE phone_tags_2
  END,
  ALTER COLUMN phone_tags_3 TYPE JSONB USING CASE 
    WHEN phone_tags_3 IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(phone_tags_3) = 'string' THEN jsonb_build_array(phone_tags_3)
    ELSE phone_tags_3
  END,
  ALTER COLUMN phone_tags_4 TYPE JSONB USING CASE 
    WHEN phone_tags_4 IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(phone_tags_4) = 'string' THEN jsonb_build_array(phone_tags_4)
    ELSE phone_tags_4
  END,
  ALTER COLUMN phone_tags_5 TYPE JSONB USING CASE 
    WHEN phone_tags_5 IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(phone_tags_5) = 'string' THEN jsonb_build_array(phone_tags_5)
    ELSE phone_tags_5
  END;

-- Add this table to the realtime publication
alter publication supabase_realtime add table properties;