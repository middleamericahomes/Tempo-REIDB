-- Fix tag handling to properly handle special characters

-- Update the store_property_tags function to properly handle special characters
CREATE OR REPLACE FUNCTION store_property_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract tags from the property and insert them into the tags table
  IF NEW.tags IS NOT NULL THEN
    INSERT INTO tags (name)
    SELECT DISTINCT unnest(NEW.tags)
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  -- Extract phone tags
  IF NEW.phone_tags_1 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT unnest(NEW.phone_tags_1), 'phone'
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_2 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT unnest(NEW.phone_tags_2), 'phone'
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_3 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT unnest(NEW.phone_tags_3), 'phone'
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_4 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT unnest(NEW.phone_tags_4), 'phone'
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  IF NEW.phone_tags_5 IS NOT NULL THEN
    INSERT INTO tags (name, category)
    SELECT DISTINCT unnest(NEW.phone_tags_5), 'phone'
    ON CONFLICT (name) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
