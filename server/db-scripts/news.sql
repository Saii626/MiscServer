CREATE TABLE IF NOT EXISTS news(
  id uuid,
  source_id text,
  source_name text,
  author text,
  title text,
  description text,
  url text,
  image_url text,
  timestamp TIMESTAMP UNIQUE
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  row_count int;
BEGIN
  DELETE FROM news WHERE timestamp < NOW() - INTERVAL '1 day';
  IF found THEN
    GET DIAGNOSTICS row_count = ROW_COUNT;
    RAISE NOTICE 'DELETED % row(s) FROM news', row_count;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_delete_old_rows ON news;
CREATE TRIGGER trigger_delete_old_rows
    AFTER INSERT OR UPDATE ON news
    EXECUTE PROCEDURE delete_old_rows();
