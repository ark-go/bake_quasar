DROP TABLE IF EXISTS ingredient CASCADE;
    CREATE TABLE IF NOT EXISTS ingredient (
     "id" BIGSERIAL PRIMARY KEY,  -- свой счетчик
     "recept_id" BIGINT NOT NULL, -- привязка списка к рецепту (table recept id) 
     "nomencl_id" BIGINT NOT NULL,       -- id элемент номенклатуры , возможно рецепта idx нет, тогда это сырьё
     "recept_idx" BIGINT DEFAULT NULL,   -- id элемент из рецепта, там брать имя рецепта, его может не быть
     "netto" NUMERIC(15,3) DEFAULT 0, 
     "brutto" NUMERIC(15,3) DEFAULT 0, 
     "itogo" NUMERIC(15,3) DEFAULT 0, 
     "comment" TEXT DEFAULT '',
     "user_id" BIGINT,
     "user_date" TIMESTAMPTZ,
     "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
     "meta" jsonb default '{}'::jsonb, /*meta*/
     FOREIGN KEY ("recept_id") REFERENCES recept ("id") ON DELETE CASCADE,
     FOREIGN KEY ("nomencl_id") REFERENCES nomencl ("id") ON DELETE RESTRICT
    );
    CREATE INDEX "IDX_ingredient_recept_id" ON "ingredient" ("recept_id");
    CREATE UNiQUE INDEX "IDX_ingredient_nomencl_id" ON "ingredient" ("recept_id","nomencl_id");
    COMMENT ON TABLE ingredient IS 'Ингредиенты recept_id ';

-- --------------------- история: на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS ingredient_h CASCADE;
    CREATE TABLE IF NOT EXISTS ingredient_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL ,
     "recept_id" BIGINT NOT NULL,
     "nomencl_id" BIGINT NOT NULL,
     "recept_idx" BIGINT DEFAULT NULL,
     "netto" NUMERIC(15,3), 
     "brutto" NUMERIC(15,3), 
     "itogo" NUMERIC(15,3), 
     "comment" TEXT,
     "user_id" BIGINT,
     "user_date" TIMESTAMPTZ,
     "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
     "meta" jsonb default '{}'::jsonb, /*meta*/
      --
     "date_h" TIMESTAMPTZ default CURRENT_TIMESTAMP, /*дата занесения  в эту таблицу */
      FOREIGN KEY ("id_parent") REFERENCES ingredient ("id") ON DELETE CASCADE
      
    );

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION ingredient_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO ingredient_h (
     "id_parent", 
     "recept_id",
     "nomencl_id",
     "recept_idx",
      "netto", 
     "brutto", 
     "itogo", 
     "comment",
     "user_id",
     "user_date",
     "deleted",
     "meta",
     "date_h"
     )
         VALUES (
           NEW."id", 
           NEW."recept_id",
           NEW."nomencl_id",
           NEW."recept_idx",
          NEW."netto", 
          NEW."brutto", 
          NEW."itogo", 
           NEW."comment", 
           NEW."user_id",
           NEW."user_date",
           NEW."deleted",
           NEW."meta",
           CURRENT_TIMESTAMP
       );
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION ingredient_history_f IS 'Создает запись в историю ingredient_h';

  DROP TRIGGER IF EXISTS ingredient_history on ingredient;
  CREATE TRIGGER ingredient_history
    AFTER INSERT OR UPDATE  ON ingredient
    FOR EACH ROW
    EXECUTE PROCEDURE ingredient_history_f();
