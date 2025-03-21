-- Fix issue with scalar extraction by ensuring all array fields are properly handled

-- First ensure all array fields are properly defined as jsonb
ALTER TABLE properties ALTER COLUMN lists TYPE jsonb USING CASE WHEN lists IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[lists]::text[]) END;
ALTER TABLE properties ALTER COLUMN tags TYPE jsonb USING CASE WHEN tags IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[tags]::text[]) END;
ALTER TABLE properties ALTER COLUMN phone_tags_1 TYPE jsonb USING CASE WHEN phone_tags_1 IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[phone_tags_1]::text[]) END;
ALTER TABLE properties ALTER COLUMN phone_tags_2 TYPE jsonb USING CASE WHEN phone_tags_2 IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[phone_tags_2]::text[]) END;
ALTER TABLE properties ALTER COLUMN phone_tags_3 TYPE jsonb USING CASE WHEN phone_tags_3 IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[phone_tags_3]::text[]) END;
ALTER TABLE properties ALTER COLUMN phone_tags_4 TYPE jsonb USING CASE WHEN phone_tags_4 IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[phone_tags_4]::text[]) END;
ALTER TABLE properties ALTER COLUMN phone_tags_5 TYPE jsonb USING CASE WHEN phone_tags_5 IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[phone_tags_5]::text[]) END;

-- Update the store_property_tags function to handle both scalar and array values
CREATE OR REPLACE FUNCTION store_property_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract tags from the property and insert them into the tags table
  IF NEW.tags IS NOT NULL THEN
    -- Handle both array and scalar values
    IF jsonb_typeof(NEW.tags) = 'array' THEN
      INSERT INTO tags (name)
      SELECT DISTINCT value::text
      FROM jsonb_array_elements_text(NEW.tags)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      -- Handle scalar value
      INSERT INTO tags (name)
      VALUES (NEW.tags::text)
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  -- Extract phone tags with similar scalar/array handling
  IF NEW.phone_tags_1 IS NOT NULL THEN
    IF jsonb_typeof(NEW.phone_tags_1) = 'array' THEN
      INSERT INTO tags (name, category)
      SELECT DISTINCT value::text, 'phone'
      FROM jsonb_array_elements_text(NEW.phone_tags_1)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      INSERT INTO tags (name, category)
      VALUES (NEW.phone_tags_1::text, 'phone')
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  -- Repeat for other phone tag fields
  IF NEW.phone_tags_2 IS NOT NULL THEN
    IF jsonb_typeof(NEW.phone_tags_2) = 'array' THEN
      INSERT INTO tags (name, category)
      SELECT DISTINCT value::text, 'phone'
      FROM jsonb_array_elements_text(NEW.phone_tags_2)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      INSERT INTO tags (name, category)
      VALUES (NEW.phone_tags_2::text, 'phone')
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  IF NEW.phone_tags_3 IS NOT NULL THEN
    IF jsonb_typeof(NEW.phone_tags_3) = 'array' THEN
      INSERT INTO tags (name, category)
      SELECT DISTINCT value::text, 'phone'
      FROM jsonb_array_elements_text(NEW.phone_tags_3)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      INSERT INTO tags (name, category)
      VALUES (NEW.phone_tags_3::text, 'phone')
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  IF NEW.phone_tags_4 IS NOT NULL THEN
    IF jsonb_typeof(NEW.phone_tags_4) = 'array' THEN
      INSERT INTO tags (name, category)
      SELECT DISTINCT value::text, 'phone'
      FROM jsonb_array_elements_text(NEW.phone_tags_4)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      INSERT INTO tags (name, category)
      VALUES (NEW.phone_tags_4::text, 'phone')
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  IF NEW.phone_tags_5 IS NOT NULL THEN
    IF jsonb_typeof(NEW.phone_tags_5) = 'array' THEN
      INSERT INTO tags (name, category)
      SELECT DISTINCT value::text, 'phone'
      FROM jsonb_array_elements_text(NEW.phone_tags_5)
      ON CONFLICT (name) DO NOTHING;
    ELSE
      INSERT INTO tags (name, category)
      VALUES (NEW.phone_tags_5::text, 'phone')
      ON CONFLICT (name) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
