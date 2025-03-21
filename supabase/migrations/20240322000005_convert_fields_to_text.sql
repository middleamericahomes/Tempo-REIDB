-- Convert all numeric and timestamp fields to TEXT type to handle special characters

-- First, alter the numeric fields
ALTER TABLE properties ALTER COLUMN bathrooms TYPE TEXT;
ALTER TABLE properties ALTER COLUMN rental_value TYPE TEXT;
ALTER TABLE properties ALTER COLUMN total_taxes TYPE TEXT;
ALTER TABLE properties ALTER COLUMN tax_delinquent_value TYPE TEXT;
ALTER TABLE properties ALTER COLUMN last_sale_price TYPE TEXT;
ALTER TABLE properties ALTER COLUMN loan_to_value TYPE TEXT;
ALTER TABLE properties ALTER COLUMN estimated_value TYPE TEXT;

-- Convert integer fields to TEXT
ALTER TABLE properties ALTER COLUMN bedrooms TYPE TEXT;
ALTER TABLE properties ALTER COLUMN sqft TYPE TEXT;
ALTER TABLE properties ALTER COLUMN storeys TYPE TEXT;
ALTER TABLE properties ALTER COLUMN year TYPE TEXT;
ALTER TABLE properties ALTER COLUMN number_of_units TYPE TEXT;
ALTER TABLE properties ALTER COLUMN tax_delinquent_year TYPE TEXT;
ALTER TABLE properties ALTER COLUMN year_behind_on_taxes TYPE TEXT;
ALTER TABLE properties ALTER COLUMN open_mortgages TYPE TEXT;

-- Convert timestamp fields to TEXT
ALTER TABLE properties ALTER COLUMN tax_auction_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN last_sold TYPE TEXT;
ALTER TABLE properties ALTER COLUMN lien_recording_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN probate_open_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN foreclosure_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN bankruptcy_recording_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN divorce_file_date TYPE TEXT;
ALTER TABLE properties ALTER COLUMN owned_since TYPE TEXT;
ALTER TABLE properties ALTER COLUMN created_at TYPE TEXT;
ALTER TABLE properties ALTER COLUMN updated_at TYPE TEXT;

-- Update the default for created_at and updated_at to store current timestamp as text
ALTER TABLE properties ALTER COLUMN created_at SET DEFAULT to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
ALTER TABLE properties ALTER COLUMN updated_at SET DEFAULT to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
