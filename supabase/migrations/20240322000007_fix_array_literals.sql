-- Fix array handling for values with special characters

-- Convert lists and tags fields to use jsonb instead of text arrays
ALTER TABLE properties ALTER COLUMN lists TYPE jsonb USING COALESCE(to_jsonb(lists), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN tags TYPE jsonb USING COALESCE(to_jsonb(tags), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN phone_tags_1 TYPE jsonb USING COALESCE(to_jsonb(phone_tags_1), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN phone_tags_2 TYPE jsonb USING COALESCE(to_jsonb(phone_tags_2), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN phone_tags_3 TYPE jsonb USING COALESCE(to_jsonb(phone_tags_3), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN phone_tags_4 TYPE jsonb USING COALESCE(to_jsonb(phone_tags_4), '[]'::jsonb);
ALTER TABLE properties ALTER COLUMN phone_tags_5 TYPE jsonb USING COALESCE(to_jsonb(phone_tags_5), '[]'::jsonb);

-- Update the store_property_tags function to handle jsonb arrays
CREATE OR REPLACE FUNCTION store_property_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract tags from the property and insert them into the tags table
  IF NEW.tags IS NOT NULL THEN
    INSERT INTO tags (name)
    SELECT DISTINCT value::text
    FROM jsonb_array_elements_text(NEW.tags)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  -- Extract phone tags
  IF NEW.phone_tags_1 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT value::text, 'phone'
    FROM jsonb_array_elements_text(NEW.phone_tags_1)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_2 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT value::text, 'phone'
    FROM jsonb_array_elements_text(NEW.phone_tags_2)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_3 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT value::text, 'phone'
    FROM jsonb_array_elements_text(NEW.phone_tags_3)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_4 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT value::text, 'phone'
    FROM jsonb_array_elements_text(NEW.phone_tags_4)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_5 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT value::text, 'phone'
    FROM jsonb_array_elements_text(NEW.phone_tags_5)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
