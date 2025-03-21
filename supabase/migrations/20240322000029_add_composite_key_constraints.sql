-- Add explicit primary key constraints to property_tags and property_lists tables
ALTER TABLE property_tags DROP CONSTRAINT IF EXISTS property_tags_pkey;
ALTER TABLE property_tags ADD PRIMARY KEY (property_id, tag_id);

ALTER TABLE property_lists DROP CONSTRAINT IF EXISTS property_lists_pkey;
ALTER TABLE property_lists ADD PRIMARY KEY (property_id, list_id);
