DROP TABLE IF EXISTS city CASCADE; 
    CREATE TABLE IF NOT EXISTS city (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/
      "region_id" BIGINT NOT NULL,  
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("region_id") REFERENCES region ("id")
    );
      COMMENT ON TABLE brand IS 'Города.';
      COMMENT ON COLUMN brand.name IS 'Наименование';