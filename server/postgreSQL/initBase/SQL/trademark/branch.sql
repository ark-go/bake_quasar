DROP TABLE IF EXISTS branch CASCADE; 
    CREATE TABLE IF NOT EXISTS branch (
      "id" BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      COMMENT ON TABLE branch IS 'Филиалы';
      COMMENT ON COLUMN branch.name IS 'Наименование';