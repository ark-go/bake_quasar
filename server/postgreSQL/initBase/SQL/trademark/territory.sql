DROP TABLE IF EXISTS territory CASCADE; 
    CREATE TABLE IF NOT EXISTS territory (
      "id" BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      COMMENT ON TABLE territory IS 'Территория.';
      COMMENT ON COLUMN territory.name IS 'Наименование';