-- Function to populate normalized tags from existing properties with fixed column names
DO $$
DECLARE
  prop RECORD;
  tag_value TEXT;
  tag_id INTEGER;
  list_value TEXT;
  list_id INTEGER;
BEGIN
  -- Process each property
  FOR prop IN SELECT id, tags, lists FROM properties WHERE tags IS NOT NULL OR lists IS NOT NULL LOOP
    
    -- Process tags
    IF prop.tags IS NOT NULL AND prop.tags::TEXT <> 'null' AND prop.tags::TEXT <> '[]' THEN
      -- Extract tags from JSONB array
      FOR tag_value IN 
        SELECT jsonb_array_elements_text(CASE 
          WHEN jsonb_typeof(prop.tags) = 'array' THEN prop.tags
          WHEN jsonb_typeof(prop.tags) = 'string' THEN jsonb_build_array(prop.tags)
          ELSE '[]'::jsonb
        END)
      LOOP
        -- Skip empty tags
        IF tag_value IS NOT NULL AND TRIM(tag_value) <> '' THEN
          -- Insert tag if it doesn't exist (based on canonical form)
          BEGIN
            INSERT INTO tags (name, name_canonical)
            VALUES (TRIM(tag_value), LOWER(TRIM(tag_value)))
            ON CONFLICT (name_canonical) DO NOTHING
            RETURNING id INTO tag_id;
          EXCEPTION WHEN OTHERS THEN
            -- If error occurs, continue with next tag
            CONTINUE;
          END;
          
          -- If tag_id is null, get the existing tag id
          IF tag_id IS NULL THEN
            BEGIN
              SELECT id INTO tag_id FROM tags WHERE name_canonical = LOWER(TRIM(tag_value));
            EXCEPTION WHEN OTHERS THEN
              -- If error occurs, continue with next tag
              CONTINUE;
            END;
          END IF;
          
          -- Create property-tag relationship
          BEGIN
            INSERT INTO property_tags (property_id, tag_id)
            VALUES (prop.id, tag_id)
            ON CONFLICT DO NOTHING;
          EXCEPTION WHEN OTHERS THEN
            -- If error occurs, continue with next tag
            CONTINUE;
          END;
        END IF;
      END LOOP;
    END IF;
    
    -- Process lists
    IF prop.lists IS NOT NULL AND prop.lists::TEXT <> 'null' AND prop.lists::TEXT <> '[]' THEN
      -- Extract lists from JSONB array
      FOR list_value IN 
        SELECT jsonb_array_elements_text(CASE 
          WHEN jsonb_typeof(prop.lists) = 'array' THEN prop.lists
          WHEN jsonb_typeof(prop.lists) = 'string' THEN jsonb_build_array(prop.lists)
          ELSE '[]'::jsonb
        END)
      LOOP
        -- Skip empty lists
        IF list_value IS NOT NULL AND TRIM(list_value) <> '' THEN
          -- Insert list if it doesn't exist (based on canonical form)
          BEGIN
            INSERT INTO lists (name, name_canonical)
            VALUES (TRIM(list_value), LOWER(TRIM(list_value)))
            ON CONFLICT (name_canonical) DO NOTHING
            RETURNING id INTO list_id;
          EXCEPTION WHEN OTHERS THEN
            -- If error occurs, continue with next list
            CONTINUE;
          END;
          
          -- If list_id is null, get the existing list id
          IF list_id IS NULL THEN
            BEGIN
              SELECT id INTO list_id FROM lists WHERE name_canonical = LOWER(TRIM(list_value));
            EXCEPTION WHEN OTHERS THEN
              -- If error occurs, continue with next list
              CONTINUE;
            END;
          END IF;
          
          -- Create property-list relationship
          BEGIN
            INSERT INTO property_lists (property_id, list_id)
            VALUES (prop.id, list_id)
            ON CONFLICT DO NOTHING;
          EXCEPTION WHEN OTHERS THEN
            -- If error occurs, continue with next list
            CONTINUE;
          END;
        END IF;
      END LOOP;
    END IF;
    
  END LOOP;
END;
$$;