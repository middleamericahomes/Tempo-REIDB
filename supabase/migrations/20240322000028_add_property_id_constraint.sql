-- Add a unique constraint on the id column of the properties table
ALTER TABLE properties
ADD CONSTRAINT properties_id_key UNIQUE (id);
