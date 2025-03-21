-- This migration fixes the error by checking if the table is already in the publication
-- before attempting to add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'properties'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  END IF;
END
$$;