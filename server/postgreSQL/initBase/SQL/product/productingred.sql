--! для рецепта
-- DROP TABLE IF EXISTS productingred CASCADE;
--     CREATE TABLE IF NOT EXISTS productingred (
--       id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,    -- ID Key
--       products_id BIGINT NOT NULL,
--       is_raw BOOLEAN NOT NULL ,
--       products_id_child BIGINT,
--       productraw_id BIGINT, 
--       massbrutto NUMERIC NOT NULL,
--       massnetto NUMERIC NOT NULL,
--       massfinish NUMERIC NOT NULL,
--       proportion_b NUMERIC,
--       proportion_n NUMERIC,
--       proportion_f NUMERIC,
--       summ_b NUMERIC,
--       description CITEXT DEFAULT '',
--       -- -- -- --
--       user_id BIGINT NOT NULL DEFAULT 0,
--       user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--       meta jsonb default '{}'::jsonb,
--       FOREIGN KEY (products_id) REFERENCES products ("id"),
--       FOREIGN KEY (products_id_child) REFERENCES products ("id"),
--       FOREIGN KEY (productraw_id) REFERENCES productraw ("id")
--     );
-- --CREATE UNIQUE INDEX "IDX_productingred_name" ON productingred (name);

-- -- product_id - это id- самой строки, product_id_child не  может быть такимже
-- alter table productingred add constraint product_id_child CHECK(products_id_child <> products_id) ;  -- enable novalidate не будет проверять таблицу

-- -- product_id_child вставка самого продукта, он может быть может не быть, но пара ID и CHILD только одна.
-- DROP INDEX IF EXISTS  "IDX_productingred_products_id_products_id_child";
-- CREATE UNIQUE INDEX "IDX_productingred_products_id_products_id_child" ON productingred (products_id,products_id_child);--,COALESCE(products_id_child,-99999999990909090));

-- DROP INDEX IF EXISTS  "IDX_productingred_products_id_productraw_id" ;
-- CREATE UNIQUE INDEX "IDX_productingred_products_id_productraw_id" ON productingred (products_id,productraw_id); --COALESCE(products_id_child,-99999999990909090));

-- COMMENT ON TABLE productingred IS 'Ингредиенты рецепта.';







-- ----------------------------------- CHECK ------------------------------------
CREATE OR REPLACE FUNCTION f_check_is_raw()
  RETURNS trigger AS
$func$
BEGIN
  --  IF TG_OP = 'UPDATE' THEN 
  --     -- если установим одно то удалим другое
  --     IF NEW.products_id_child IS NOT NULL 
  --       THEN
  --       NEW.is_raw = TRUE;
  --       NEW.productraw_id = NULL;
  --     END IF;
  --     IF NEW.productraw_id IS NOT NULL 
  --      THEN
  --       NEW.is_raw = FALSE;
  --       NEW.products_id_child = NULL;
  --     END IF;
  --  END IF;
    -- нельзя выбрать is_raw = false и установить products_id_child
    IF NEW.is_raw = TRUE AND NEW.products_id_child IS NOT NULL 
      OR
      -- нельзя выбрать is_raw false и установить productraw_id
      NEW.is_raw = FALSE AND NEW.productraw_id IS NOT NULL
      OR
      -- нельзя установить два поля сразу
      NEW.products_id_child IS NOT NULL AND NEW.productraw_id IS NOT NULL
      THEN
    RAISE EXCEPTION 'Не верный выбор is_raw > %',TG_NAME;
    END IF;

  


--   NEW.is_raw := TRUE;
  RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_is_raw ON productingred;
CREATE TRIGGER check_is_raw
  BEFORE INSERT OR UPDATE OF products_id,is_raw,productraw_id,products_id_child  ON productingred  --  
  FOR EACH ROW
  EXECUTE PROCEDURE f_check_is_raw();
--   --------------
