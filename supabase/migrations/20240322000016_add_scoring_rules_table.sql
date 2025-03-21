-- Create scoring rules table
CREATE TABLE IF NOT EXISTS scoring_rules (
  id SERIAL PRIMARY KEY,
  configuration_id TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  field_name TEXT,
  operator TEXT,
  value TEXT,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scoring configurations table
CREATE TABLE IF NOT EXISTS scoring_configurations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property scores table
CREATE TABLE IF NOT EXISTS property_scores (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  configuration_id TEXT NOT NULL REFERENCES scoring_configurations(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, configuration_id)
);

-- Add these tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE scoring_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE scoring_configurations;
ALTER PUBLICATION supabase_realtime ADD TABLE property_scores;
