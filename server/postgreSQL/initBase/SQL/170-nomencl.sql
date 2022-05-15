DROP TABLE IF EXISTS nomencl CASCADE;
    CREATE TABLE IF NOT EXISTS nomencl (
      "id" BIGSERIAL PRIMARY KEY,  -- свой счетчик
      "article" CITEXT UNIQUE,
      "name" CITEXT NOT NULL, /*Наименование*/ 
      "unit_id" BIGINT NOT NULL, /*Ед измерения*/
      "vidnomencl_id" BIGINT NOT NULL, /*Вид номенклатуры*/
      "groupraw_id" BIGINT, /*группа сырья*/
      "vidraw_id" BIGINT, /* вид  сырья*/
      "hidden" BOOLEAN DEFAULT FALSE, /*скрыть из списка */ 
      "user_id" BIGINT,
      "user_date" TIMESTAMPTZ,  /* дата занесения - изменения*/
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE, /* флаг удаления */
      "extend" BIGINT,  /*Расширение таблицы*/
      "meta" jsonb default '{}'::jsonb, /*meta*/
      FOREIGN KEY ("vidnomencl_id") REFERENCES vidnomencl ("id") ON DELETE RESTRICT,
      FOREIGN KEY ("groupraw_id") REFERENCES groupraw ("id") ON DELETE RESTRICT,
      FOREIGN KEY ("vidraw_id") REFERENCES vidraw ("id") ON DELETE RESTRICT,
      FOREIGN KEY ("unit_id") REFERENCES unit ("id") ON DELETE RESTRICT
    );
    CREATE UNIQUE INDEX "IDX_nomencl_name" ON "nomencl" ("name");
    COMMENT ON TABLE nomencl IS 'Номенклатура';

-- --------------------- история: на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS nomencl_h ;
    CREATE TABLE IF NOT EXISTS nomencl_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "article" CITEXT,
     "name" CITEXT NOT NULL, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "unit_id" BIGINT NOT NULL, /*Ед измерения*/
      "vidnomencl_id" BIGINT NOT NULL, /*Вид номенклатуры*/
      "groupraw_id" BIGINT, /*группа сырья*/
      "vidraw_id" BIGINT, /* вид  сырья*/
      "hidden" BOOLEAN DEFAULT FALSE, /*скрыть из списка */ 
      "user_id" BIGINT, /* пооследнее действие */
      "user_date" TIMESTAMPTZ,  /* дата занесения - изменения*/
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE, /* флаг удаления */
      "extend" BIGINT,  /*Расширение таблицы*/
      "meta" jsonb default '{}'::jsonb, /*meta*/
      --
      "date_h" TIMESTAMPTZ default CURRENT_TIMESTAMP, /*дата занесения  в эту таблицу */
      FOREIGN KEY ("id_parent") REFERENCES nomencl ("id") ON DELETE CASCADE
    );

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION nomencl_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO nomencl_h (
      "id_parent", 
      "article",
      "name", 
      "unit_id",
      "vidnomencl_id",
      "groupraw_id",
      "vidraw_id",
      "hidden", 
      "user_id",
      "user_date",
      "deleted",
      "extend",
      "meta",
      "date_h"
        )
         VALUES (
           NEW."id", 
           NEW."article",
           NEW."name", 
           NEW."unit_id",
           NEW."vidnomencl_id",
           NEW."groupraw_id",
           NEW."vidraw_id",
           NEW."hidden", 
           NEW."user_id",
           NEW."user_date",
           NEW."deleted",
           NEW."extend",
           NEW."meta",
           CURRENT_TIMESTAMP
       );
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION nomencl_history_f IS 'Создает запись в историю nomencl_h';

  DROP TRIGGER IF EXISTS nomencl_history on nomencl;
  CREATE TRIGGER nomencl_history
    AFTER INSERT OR UPDATE  ON nomencl
    FOR EACH ROW
    EXECUTE PROCEDURE nomencl_history_f();
-- ------------------------- ------------ ------------------- --------------- -----------------
CREATE OR REPLACE FUNCTION nomencl_add_article()  RETURNS TRIGGER AS
     $BODY$
     DECLARE
	  _art TEXT;
     _pref TEXT;
     
     BEGIN
       SELECT 
         CASE
         WHEN meta::jsonb->>'prefArticle' is null THEN '!NA'
         ELSE meta::jsonb->>'prefArticle' 
         END 
         AS pref
      FROM vidnomencl WHERE id=NEW.vidnomencl_id
      INTO _pref;
	  _art := _pref || '-' || CAST(nextval('seq_article') AS TEXT);
--	  _art := '{"article":"' || _art || '"}';
--      NEW.meta = NEW.meta::jsonb || _art::jsonb;
      NEW."article" = _art;
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION nomencl_add_article IS 'Создает article на основе вида номенклатуры';

  DROP TRIGGER IF EXISTS nomencl_article on nomencl;
  CREATE TRIGGER nomencl_article
    BEFORE INSERT ON nomencl
    FOR EACH ROW
    EXECUTE PROCEDURE nomencl_add_article();