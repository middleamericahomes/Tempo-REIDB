-- Create scoring rules table
CREATE TABLE IF NOT EXISTS scoring_configurations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scoring_rules (
  id SERIAL PRIMARY KEY,
  configuration_id TEXT NOT NULL REFERENCES scoring_configurations(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  field_name TEXT,
  operator TEXT,
  value TEXT,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property scores table
CREATE TABLE IF NOT EXISTS property_scores (
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  configuration_id TEXT NOT NULL REFERENCES scoring_configurations(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, configuration_id)
);

-- Try to add tables to realtime publication, ignoring errors if already added
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE scoring_configurations;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication, ignore
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE scoring_rules;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication, ignore
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE property_scores;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication, ignore
  END;
END;
$$;
