
-- Тип продукции
DROP TABLE IF EXISTS producttype CASCADE;
    CREATE TABLE IF NOT EXISTS producttype (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,    -- ID Key
      name CITEXT UNIQUE NOT NULL,       -- id Торговая сеть
      prefix CITEXT UNIQUE NOT NULL,      -- префикс для артикула, будет влиять на все продукты
      -- -- -- --
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_producttype_name" ON producttype (name);
COMMENT ON TABLE producttype IS 'Тип продукции.';

-- Вид сырья
DROP TABLE IF EXISTS productrawvid CASCADE;
    CREATE TABLE IF NOT EXISTS productrawvid (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,    -- ID Key
      name CITEXT UNIQUE NOT NULL,       -- id Торговая сеть
      prefix CITEXT UNIQUE NOT NULL,      -- префикс для артикула , будет влиять на все сырье
      -- -- --
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_productrawvid_name" ON productrawvid (name);
COMMENT ON TABLE productrawvid IS 'Вид сырья.';