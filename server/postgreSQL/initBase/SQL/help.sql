DROP TABLE IF EXISTS help CASCADE; 
    CREATE TABLE IF NOT EXISTS help (
      "id" BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик
      "codehelp" CITEXT NOT NULL UNIQUE,
      "help" CITEXT, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      COMMENT ON TABLE help IS 'Справка окна, формы, текущего места';
      COMMENT ON COLUMN codehelp.name IS 'код справки';
      COMMENT ON COLUMN help.name IS 'сам текст спраки';
