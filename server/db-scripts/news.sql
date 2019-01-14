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
