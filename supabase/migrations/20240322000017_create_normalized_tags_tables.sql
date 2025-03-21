-- Create normalized tags table with case-sensitive display and case-insensitive uniqueness
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  tag_name TEXT NOT NULL,
  tag_name_canonical TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT tags_canonical_unique UNIQUE (tag_name_canonical)
);

-- Create normalized lists table with the same pattern
CREATE TABLE IF NOT EXISTS lists (
  id SERIAL PRIMARY KEY,
  list_name TEXT NOT NULL,
  list_name_canonical TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT lists_canonical_unique UNIQUE (list_name_canonical)
);

-- Create many-to-many relationship tables
CREATE TABLE IF NOT EXISTS property_tags (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, tag_id)
);

CREATE TABLE IF NOT EXISTS property_lists (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, list_id)
);

-- Add these tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE tags;
ALTER PUBLICATION supabase_realtime ADD TABLE lists;
ALTER PUBLICATION supabase_realtime ADD TABLE property_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE property_lists;
