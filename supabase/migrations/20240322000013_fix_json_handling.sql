-- Fix JSON handling for tag fields

-- Function to safely convert any value to a valid JSONB array
CREATE OR REPLACE FUNCTION safe_to_jsonb_array(input_value TEXT)
RETURNS JSONB AS $$
BEGIN
  -- If input is NULL, return empty array
  IF input_value IS NULL THEN
    RETURN '[]'::JSONB;
  END IF;
  
  -- Try to parse as JSON
  BEGIN
    -- If it's already valid JSON, return it
    RETURN input_value::JSONB;
  EXCEPTION WHEN OTHERS THEN
    -- If it's not valid JSON, try to wrap it as an array
    BEGIN
      RETURN ('["' || input_value || '"]')::JSONB;
    EXCEPTION WHEN OTHERS THEN
      -- If all else fails, return empty array
      RETURN '[]'::JSONB;
    END;
  END;
END;
$$ LANGUAGE plpgsql;

-- Fix tags field
UPDATE properties
SET tags = CASE
  WHEN tags IS NULL THEN '[]'::JSONB
  WHEN tags::TEXT = 'null' THEN '[]'::JSONB
  WHEN tags::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(tags::TEXT)
END;

-- Fix lists field
UPDATE properties
SET lists = CASE
  WHEN lists IS NULL THEN '[]'::JSONB
  WHEN lists::TEXT = 'null' THEN '[]'::JSONB
  WHEN lists::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(lists::TEXT)
END;

-- Fix phone_tags fields
UPDATE properties
SET phone_tags_1 = CASE
  WHEN phone_tags_1 IS NULL THEN '[]'::JSONB
  WHEN phone_tags_1::TEXT = 'null' THEN '[]'::JSONB
  WHEN phone_tags_1::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(phone_tags_1::TEXT)
END;

UPDATE properties
SET phone_tags_2 = CASE
  WHEN phone_tags_2 IS NULL THEN '[]'::JSONB
  WHEN phone_tags_2::TEXT = 'null' THEN '[]'::JSONB
  WHEN phone_tags_2::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(phone_tags_2::TEXT)
END;

UPDATE properties
SET phone_tags_3 = CASE
  WHEN phone_tags_3 IS NULL THEN '[]'::JSONB
  WHEN phone_tags_3::TEXT = 'null' THEN '[]'::JSONB
  WHEN phone_tags_3::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(phone_tags_3::TEXT)
END;

UPDATE properties
SET phone_tags_4 = CASE
  WHEN phone_tags_4 IS NULL THEN '[]'::JSONB
  WHEN phone_tags_4::TEXT = 'null' THEN '[]'::JSONB
  WHEN phone_tags_4::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(phone_tags_4::TEXT)
END;

UPDATE properties
SET phone_tags_5 = CASE
  WHEN phone_tags_5 IS NULL THEN '[]'::JSONB
  WHEN phone_tags_5::TEXT = 'null' THEN '[]'::JSONB
  WHEN phone_tags_5::TEXT = '' THEN '[]'::JSONB
  ELSE safe_to_jsonb_array(phone_tags_5::TEXT)
END;

-- Check if list_stack column exists and fix it too
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'list_stack') THEN
    UPDATE properties
    SET list_stack = CASE
      WHEN list_stack IS NULL THEN '[]'::JSONB
      WHEN list_stack::TEXT = 'null' THEN '[]'::JSONB
      WHEN list_stack::TEXT = '' THEN '[]'::JSONB
      ELSE safe_to_jsonb_array(list_stack::TEXT)
    END;
  END IF;
END
$$;