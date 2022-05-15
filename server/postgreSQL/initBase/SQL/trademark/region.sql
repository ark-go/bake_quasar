DROP TABLE IF EXISTS region CASCADE; 
    CREATE TABLE IF NOT EXISTS region (
      "id" BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "regnum" CITEXT, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      DROP INDEX IF EXISTS region_name;
      CREATE INDEX region_regnum on region ("regnum"); 
      COMMENT ON TABLE region IS 'Регионы';
      COMMENT ON COLUMN region.name IS 'Наименование';
      COMMENT ON COLUMN region.regnum IS 'Номер региона';