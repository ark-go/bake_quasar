--! НЕ забываем это Общий счетчик на две таблицы !!!
--CREATE SEQUENCE products_raw_sequence
--INCREMENT 1
--START 1000;
--CREATE SEQUENCE products_raw_sequence_pk
--INCREMENT 1
--START 1;
-- Вид продукции не продается
DROP TABLE IF EXISTS productvid CASCADE;
CREATE TABLE IF NOT EXISTS productvid (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  -- ID Key
  name CITEXT UNIQUE NOT NULL,
  -- id Торговая сеть
  fullname CITEXT DEFAULT '',
  unit_id BIGINT NOT NULL,
  productassortment_id BIGINT NOT NULL,
  description CITEXT default '',
  --      article CITEXT UNIQUE DEFAULT nextval('products_raw_sequence')::CITEXT NOT NULL ,
  -- -- -- --
  user_id BIGINT NOT NULL DEFAULT 0,
  user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  meta jsonb NOT NULL default '{}'::jsonb,
  FOREIGN KEY (unit_id) REFERENCES unit ("id") ON DELETE RESTRICT,
  FOREIGN KEY (productassortment_id) REFERENCES productassortment ("id") ON DELETE RESTRICT
);
COMMENT ON TABLE productvid IS 'Вид продукции.';
--!!! Будет fullname  как дополнительное имя nameext
ALTER TABLE productvid
ADD COLUMN nameext CITEXT;
alter table productvid
add constraint nameext CHECK(char_length(trim(nameext)) <> 0);
-- enable novalidate не будет проверять таблицу
CREATE UNIQUE INDEX "IDX_productvid_name_nameext" ON productvid (name, nameext);
-- -------- Сыпье - можно продать
DROP TABLE IF EXISTS productraw CASCADE;
CREATE TABLE IF NOT EXISTS productraw (
  id BIGINT NOT NULL PRIMARY KEY,
  -- ID Key
  is_raw BOOLEAN DEFAULT TRUE,
  productrawvid_id BIGINT NOT NULL,
  -- вид сырья
  name CITEXT UNIQUE NOT NULL,
  -- наименование
  fullname CITEXT DEFAULT '',
  -- полное имя
  unit_id BIGINT NOT NULL,
  -- ед измерения
  description CITEXT default '',
  -- просто так
  article_buh CITEXT UNIQUE,
  -- если захотят интеграцию
  article CITEXT UNIQUE DEFAULT nextval('products_raw_sequence')::CITEXT NOT NULL,
  -- наш собственный артикле
  -- -- -- --
  user_id BIGINT NOT NULL DEFAULT 0,
  user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  meta jsonb NOT NULL default '{}'::jsonb,
  FOREIGN KEY (unit_id) REFERENCES unit ("id") ON DELETE RESTRICT,
  FOREIGN KEY (productrawvid_id) REFERENCES productrawvid ("id") ON DELETE RESTRICT
);
COMMENT ON TABLE productraw IS 'Сырьё.';
-- --------- BEFORE INSERT  Primary key
CREATE OR REPLACE FUNCTION f_productraw_primary_key() RETURNS trigger AS $func$ BEGIN NEW.id := nextval('products_raw_sequence_pk');
NEW.is_raw := TRUE;
RETURN NEW;
END $func$ LANGUAGE plpgsql;
CREATE TRIGGER productraw_primary_key BEFORE
INSERT ON productraw --
  FOR EACH ROW EXECUTE PROCEDURE f_productraw_primary_key();
-- --------- BEFORE UPDATE Primary key
CREATE OR REPLACE FUNCTION f_productraw_upd() RETURNS trigger AS $func$ BEGIN NEW.is_raw := TRUE;
RETURN NEW;
END $func$ LANGUAGE plpgsql;
CREATE TRIGGER productraw_upd BEFORE
UPDATE ON productraw -- 
  FOR EACH ROW EXECUTE PROCEDURE f_productraw_upd();
-- --------- продукция продается
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE IF NOT EXISTS products (
  id BIGINT NOT NULL PRIMARY KEY,
  -- ID Key
  is_raw BOOLEAN DEFAULT FALSE,
  productvid_id BIGINT NOT NULL,
  -- вид продукта  и его имя должно быть одним уникальным
  name CITEXT NOT NULL,
  --  короткое имя куска от окончания названия - вида продукта
  fullname CITEXT DEFAULT '',
  -- темп
  unit_id BIGINT NOT NULL,
  -- ед измерения
  description CITEXT default '',
  --  
  document_num CITEXT default '',
  document_date TIMESTAMPTZ,
  article_buh CITEXT UNIQUE,
  -- если захотят интеграцию
  article CITEXT UNIQUE DEFAULT nextval('products_raw_sequence')::CITEXT NOT NULL,
  -- собственный артикул
  -- -- -- --
  user_id BIGINT NOT NULL DEFAULT 0,
  user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  meta jsonb NOT NULL default '{}'::jsonb,
  FOREIGN KEY (unit_id) REFERENCES unit ("id") ON DELETE RESTRICT,
  FOREIGN KEY (productvid_id) REFERENCES productvid ("id") ON DELETE RESTRICT
);
COMMENT ON TABLE products IS 'Продукция.';
CREATE OR REPLACE FUNCTION f_products_primary_key() RETURNS trigger AS $func$ BEGIN --NEW.id := nextval(pg_get_serial_sequence('productraw', 'id'));
  NEW.id := nextval('products_raw_sequence_pk');
NEW.is_raw := FALSE;
RETURN NEW;
END $func$ LANGUAGE plpgsql;
CREATE TRIGGER products_primary_key BEFORE
INSERT ON products --
  FOR EACH ROW EXECUTE PROCEDURE f_products_primary_key();
-- --------- BEFORE UPDATE Primary key
CREATE OR REPLACE FUNCTION f_products_upd() RETURNS trigger AS $func$ BEGIN NEW.is_raw := FALSE;
RETURN NEW;
END $func$ LANGUAGE plpgsql;
CREATE TRIGGER products_upd BEFORE
UPDATE ON products -- 
  FOR EACH ROW EXECUTE PROCEDURE f_products_upd();