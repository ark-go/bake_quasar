DROP TABLE IF EXISTS trademark CASCADE; 
    CREATE TABLE IF NOT EXISTS trademark (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/
      "brand_id" BIGINT NOT NULL,  
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("brand_id") REFERENCES brand ("id")
    );
      COMMENT ON TABLE brand IS 'Торговые сети.';
      COMMENT ON COLUMN brand.name IS 'Наименование';
      --COMMENT ON CONSTRAINT` constraint_name ON table_name IS 'text'`