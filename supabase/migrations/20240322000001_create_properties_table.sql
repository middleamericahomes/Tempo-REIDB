CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  mailing_address TEXT,
  mailing_city TEXT,
  mailing_state TEXT,
  mailing_zip TEXT,
  mailing_zip5 TEXT,
  mailing_county TEXT,
  mailing_vacant BOOLEAN,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  property_zip5 TEXT,
  property_county TEXT,
  property_vacant BOOLEAN,
  business_name TEXT,
  status TEXT,
  lists TEXT[],
  tags TEXT[],
  email_1 TEXT,
  email_2 TEXT,
  email_3 TEXT,
  email_4 TEXT,
  email_5 TEXT,
  email_6 TEXT,
  email_7 TEXT,
  email_8 TEXT,
  email_9 TEXT,
  email_10 TEXT,
  phone_1 TEXT,
  phone_type_1 TEXT,
  phone_status_1 TEXT,
  phone_tags_1 TEXT[],
  phone_2 TEXT,
  phone_type_2 TEXT,
  phone_status_2 TEXT,
  phone_tags_2 TEXT[],
  phone_3 TEXT,
  phone_type_3 TEXT,
  phone_status_3 TEXT,
  phone_tags_3 TEXT[],
  phone_4 TEXT,
  phone_type_4 TEXT,
  phone_status_4 TEXT,
  phone_tags_4 TEXT[],
  phone_5 TEXT,
  phone_type_5 TEXT,
  phone_status_5 TEXT,
  phone_tags_5 TEXT[],
  bedrooms INTEGER,
  bathrooms NUMERIC,
  sqft INTEGER,
  air_conditioner TEXT,
  heating_type TEXT,
  storeys INTEGER,
  year INTEGER,
  above_grade TEXT,
  rental_value NUMERIC,
  building_use_code TEXT,
  neighborhood_rating TEXT,
  structure_type TEXT,
  number_of_units INTEGER,
  apn TEXT,
  parcel_id TEXT,
  legal_description TEXT,
  lot_size TEXT,
  land_zoning TEXT,
  tax_auction_date TIMESTAMP WITH TIME ZONE,
  total_taxes NUMERIC,
  tax_delinquent_value NUMERIC,
  tax_delinquent_year INTEGER,
  year_behind_on_taxes INTEGER,
  deed TEXT,
  mls TEXT,
  last_sale_price NUMERIC,
  last_sold TIMESTAMP WITH TIME ZONE,
  lien_type TEXT,
  lien_recording_date TIMESTAMP WITH TIME ZONE,
  personal_representative TEXT,
  personal_representative_phone TEXT,
  probate_open_date TIMESTAMP WITH TIME ZONE,
  attorney_on_file TEXT,
  foreclosure_date TIMESTAMP WITH TIME ZONE,
  bankruptcy_recording_date TIMESTAMP WITH TIME ZONE,
  divorce_file_date TIMESTAMP WITH TIME ZONE,
  loan_to_value NUMERIC,
  open_mortgages INTEGER,
  mortgage_type TEXT,
  owned_since TIMESTAMP WITH TIME ZONE,
  estimated_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  import_batch_id TEXT,
  source TEXT
);

alter publication supabase_realtime add table properties;