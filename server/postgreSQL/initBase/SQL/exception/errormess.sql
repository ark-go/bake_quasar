DROP TABLE IF EXISTS errormess CASCADE;
    CREATE TABLE IF NOT EXISTS errormess (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,    -- ID Key
      errorname CITEXT NOT NULL,       -- id Торговая сеть
      message CITEXT NOT NULL,
      messageaction CITEXT DEFAULT '',
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_errormess_errorname" ON errormess (errorname);
COMMENT ON TABLE errormess IS 'Расшифровка ошибок.';