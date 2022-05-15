--! НЕ забываем это Общий счетчик на две таблицы !!!
-- --------- продукция продается

DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT NOT NULL PRIMARY KEY,    -- ID Key
      is_raw BOOLEAN DEFAULT FALSE, 
      productvid_id BIGINT NOT NULL,   -- вид продукта  и его имя должно быть одним уникальным
     --! изенено name CITEXT NOT NULL CONSTRAINT products_name_length CHECK(char_length(trim(name)) > 2),       --  короткое имя куска от окончания названия - вида продукта
     --! - fullname CITEXT DEFAULT '',  -- темп
    name
    massa

      unit_id BIGINT NOT NULL,  -- ед измерения
      
      description CITEXT default '', --  
      document_num CITEXT default '',
      document_date TIMESTAMPTZ,
      article_buh CITEXT UNIQUE,   -- если захотят интеграцию
      article CITEXT UNIQUE DEFAULT nextval('products_raw_sequence')::CITEXT NOT NULL, -- собственный артикул
      -- -- -- --
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb NOT NULL default '{}'::jsonb,
      FOREIGN KEY (unit_id) REFERENCES unit ("id") ON DELETE RESTRICT,
      FOREIGN KEY (productvid_id) REFERENCES productvid ("id") ON DELETE RESTRICT
    );

COMMENT ON TABLE products IS 'Продукция.';
CREATE UNIQUE INDEX "IDX_products_vid_name" ON products (productvid_id,name);

CREATE OR REPLACE FUNCTION f_products_primary_key()
  RETURNS trigger AS
$func$
BEGIN
   --NEW.id := nextval(pg_get_serial_sequence('productraw', 'id'));
   NEW.id := nextval('products_raw_sequence_pk');
   NEW.is_raw := FALSE;
   RETURN NEW;
END
$func$  LANGUAGE plpgsql;

CREATE TRIGGER products_primary_key
  BEFORE INSERT ON products  --
  FOR EACH ROW
  EXECUTE PROCEDURE f_products_primary_key();

-- --------- BEFORE UPDATE Primary key
CREATE OR REPLACE FUNCTION f_products_upd()
  RETURNS trigger AS
$func$
BEGIN
   NEW.is_raw := FALSE;
   RETURN NEW;
END
$func$  LANGUAGE plpgsql;

CREATE TRIGGER products_upd
  BEFORE UPDATE ON products  -- 
  FOR EACH ROW
  EXECUTE PROCEDURE f_products_upd();