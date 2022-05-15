DROP TABLE IF EXISTS bakery CASCADE;
    CREATE TABLE IF NOT EXISTS bakery (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- ID Key  ключ  для всех!
      name CITEXT NOT NULL CONSTRAINT name_textlength CHECK(char_length(trim(name)) > 2),
      franch BOOLEAN NOT NULL DEFAULT FALSE,  -- печка во франшизе
      trademark_id BIGINT NOT NULL   REFERENCES trademark (id),
      territory_id BIGINT NOT NULL   REFERENCES territory (id),
      branch_id BIGINT NOT NULL      REFERENCES branch (id),
      city_id BIGINT NOT NULL        REFERENCES city (id),
      address CITEXT NOT NULL DEFAULT '',
      dateopen TIMESTAMPTZ DEFAULT NULL,
      dateclose TIMESTAMPTZ DEFAULT NULL,
      area NUMERIC NOT NULL DEFAULT 0      CONSTRAINT positive_area CHECK(area >= 0),
      kolbakers NUMERIC NOT NULL DEFAULT 0 CONSTRAINT positive_kolbakers CHECK(kolbakers >= 0),
      ispack BOOLEAN NOT NULL DEFAULT FALSE,
      own_kagent_id BIGINT NOT NULL  REFERENCES kagent (id),
      --tm_kagent_id BIGINT NOT NULL   REFERENCES kagent (id),    --
      kagent_tm_id BIGINT NOT NULL   REFERENCES kagent_tm (id), -- ссылка на kagent_tm там реальный kagent
      fr_kagent_id BIGINT NOT NULL   REFERENCES kagent (id),
      description CITEXT DEFAULT '',
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb NOT NULL default '{}'::jsonb
    --  FOREIGN KEY ("trademark_id") REFERENCES trademark ("id"),
    --  FOREIGN KEY ("territory_id") REFERENCES territory ("id"),
    --  FOREIGN KEY ("branch_id") REFERENCES branch ("id"),
    --  FOREIGN KEY ("city_id") REFERENCES city ("id"),
    --  FOREIGN KEY ("own_kagent_id") REFERENCES kagent ("id"),
    --  FOREIGN KEY ("tm_kagent_id") REFERENCES kagent ("id"),
    --  FOREIGN KEY ("fr_kagent_id") REFERENCES kagent ("id")
    );
    COMMENT ON TABLE bakery IS 'Пекарни'; 
    DROP INDEX IF EXISTS "IDX_bakery_name";     
    CREATE UNIQUE INDEX "IDX_bakery_name" ON bakery ("name");
    COMMENT ON COLUMN bakery.name IS 'Наименование';
    COMMENT ON COLUMN bakery.description IS 'Описание';
    COMMENT ON COLUMN bakery.fr_kagent_id IS 'для этого поля триггер проверяющий NULL';

--! Важненько и не забыть
--ALTER TABLE bakery ADD CONSTRAINT positive_kolbakers CHECK (kolbakers >= 0);
--ALTER TABLE bakery ADD CONSTRAINT positive_area CHECK (area >= 0);
--! что еще делал
--update bakery set meta='{}'::jsonb -- все на json
--alter table bakery ALTER meta SET NOT NULL
-- alter table bakery ALTER meta DROP NOT NULL
--!
-- ---------------
CREATE OR REPLACE FUNCTION FN_bake_fr_kagent_id_null()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fr_kagent_id IS NULL
  THEN
     NEW.fr_kagent_id := (SELECT id FROM kagent
               WHERE meta ->>'system_select' = 'true'
               LIMIT 1);
     IF NEW.fr_kagent_id IS NULL THEN
         RAISE EXCEPTION 'Не найден "Контрагент франчайзи" по умолчанию!';
     END IF; 
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--- -----------------------
    DROP TRIGGER IF EXISTS bakery_fr_kagent_id_null on bakery;
      CREATE TRIGGER bakery_fr_kagent_id_null
      BEFORE INSERT OR UPDATE OF fr_kagent_id ON bakery
      FOR EACH ROW
    -- WHEN (OLD.admin_id IS DISTINCT FROM NEW.admin_id)
      EXECUTE PROCEDURE FN_bake_fr_kagent_id_null();