DROP TABLE IF EXISTS brand CASCADE; 
    CREATE TABLE IF NOT EXISTS brand (
      "id" BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      COMMENT ON TABLE brand IS 'Бренды торговых сетей.';
      COMMENT ON COLUMN brand.name IS 'Наименование';