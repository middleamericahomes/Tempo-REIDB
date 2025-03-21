-- Fix empty tags issue by ensuring all tag fields have proper JSONB format

-- Update any null or empty tag fields to be proper empty arrays
UPDATE properties
SET tags = '[]'::JSONB
WHERE tags IS NULL OR tags::TEXT = 'null';

-- Update any null or empty lists fields to be proper empty arrays
UPDATE properties
SET lists = '[]'::JSONB
WHERE lists IS NULL OR lists::TEXT = 'null';

-- Update any null or empty phone_tags fields to be proper empty arrays
UPDATE properties
SET phone_tags_1 = '[]'::JSONB
WHERE phone_tags_1 IS NULL OR phone_tags_1::TEXT = 'null';

UPDATE properties
SET phone_tags_2 = '[]'::JSONB
WHERE phone_tags_2 IS NULL OR phone_tags_2::TEXT = 'null';

UPDATE properties
SET phone_tags_3 = '[]'::JSONB
WHERE phone_tags_3 IS NULL OR phone_tags_3::TEXT = 'null';

UPDATE properties
SET phone_tags_4 = '[]'::JSONB
WHERE phone_tags_4 IS NULL OR phone_tags_4::TEXT = 'null';

UPDATE properties
SET phone_tags_5 = '[]'::JSONB
WHERE phone_tags_5 IS NULL OR phone_tags_5::TEXT = 'null';

-- Check if list_stack column exists before updating it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'list_stack') THEN
    UPDATE properties
    SET list_stack = '[]'::JSONB
    WHERE list_stack IS NULL OR list_stack::TEXT = 'null';
  END IF;
END
$$;

-- Add this table to the realtime publication if it's not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'properties'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE properties;
  END IF;
END
$$;