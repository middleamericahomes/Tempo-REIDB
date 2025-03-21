-- Create tags table for storing unique tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to extract and store tags
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

-- Create trigger to automatically store tags when properties are inserted or updated
DROP TRIGGER IF EXISTS property_tags_trigger ON properties;
CREATE TRIGGER property_tags_trigger
AFTER INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION store_property_tags();

-- Enable realtime for tags table
alter publication supabase_realtime add table tags;
