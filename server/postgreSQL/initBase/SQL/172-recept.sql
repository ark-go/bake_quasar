-- Все рецепты
-- ключом является nomencl_id
-- рецепт привязан к номенклатуре
-- названия не повторять в пределах номенклатуры?
DROP TABLE IF EXISTS recept CASCADE;

DROP SEQUENCE IF EXISTS seq_article;
CREATE SEQUENCE IF NOT EXISTS seq_article cache 1 start 1000;

    CREATE TABLE IF NOT EXISTS recept (
      "id" BIGSERIAL PRIMARY KEY,  -- свой счетчик
      "nomencl_id" BIGINT NOT NULL, -- кому принадлежит рецепт, какой номенклатуре
      "article" CITEXT NOT NULL DEFAULT 'RP-' || CAST(nextval('seq_article') AS TEXT),
      "name" CITEXT NOT NULL, /*Наименование*/ 
      "date_recept" TIMESTAMPTZ default CURRENT_TIMESTAMP, /* дата рецепта */
      "text" TEXT DEFAULT '', /* Опиание технологии */
      "doc" BIGINT, /* документы файлы */
      "user_id" BIGINT,
      "user_date" TIMESTAMPTZ,
      "deleted" BOOLEAN DEFAULT FALSE,
      "extend" BIGINT,  /*Расширение таблицы*/
      "meta" jsonb default '{}'::jsonb, /*meta*/
      FOREIGN KEY ("nomencl_id") REFERENCES nomencl ("id") ON DELETE RESTRICT -- Запрещаем удалять номенклатуру
    );
   -- CREATE UNIQUE INDEX "IDX_recept_name" ON "recept" ("name");
   -- CREATE UNIQUE INDEX "IDX_recept_nomencl_id" ON "recept" ("nomencl_id");
    CREATE UNIQUE INDEX "IDX_recept_article" ON "recept" ("article");
    CREATE UNIQUE INDEX "IDX_recept_nomencl_name" ON "recept" ("nomencl_id","name");
    COMMENT ON TABLE recept IS 'Рецепты key nomencl.';

-- --------------------- история: на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS recept_h ;
    CREATE TABLE IF NOT EXISTS recept_h (
      "id" BIGSERIAL PRIMARY KEY,  -- свой счетчик
      "id_parent" BIGINT NOT NULL,
      "nomencl_id" BIGINT NOT NULL,
      "article" CITEXT,
      "name" CITEXT NOT NULL, /*Наименование*/ 
      "date_recept" TIMESTAMPTZ, /* дата рецепта */
      "text" TEXT DEFAULT '', /* Опиание технологии */
      "doc" BIGINT, /* документы файлы */
      "user_id" BIGINT,
      "user_date" TIMESTAMPTZ,
      "deleted" BOOLEAN DEFAULT FALSE,
      "extend" BIGINT,  /*Расширение таблицы*/
      "meta" jsonb default '{}'::jsonb, /*meta*/
      --
      "date_h" TIMESTAMPTZ, /*дата занесения  в эту таблицу */
      FOREIGN KEY ("id_parent") REFERENCES recept ("id") ON DELETE CASCADE
    );
     
-- -- - -- - -----------------------------
    CREATE OR REPLACE FUNCTION recept_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO recept_h (
      "id_parent",
      "nomencl_id",
      "article",
      "name", /*Наименование*/ 
      "date_recept" , /* дата рецепта */
      "text", /* Опиание технологии */
      "doc", /* документы файлы */
      "user_id",
      "user_date",
      "deleted",
      "extend",  /*Расширение таблицы*/
      "meta", /*meta*/
       --
      "date_h" /*дата занесения  в эту таблицу */

        )
         VALUES (
      NEW."id",  /*id_parent*/
      NEW."nomencl_id",
      NEW."article",
      NEW."name", /*Наименование*/ 
      NEW."date_recept", /* дата рецепта */
      NEW."text", /* Опиание технологии */
      NEW."doc", /* документы файлы */
      NEW."user_id",
      NEW."user_date", /*это пользователь*/
      NEW."deleted",
      NEW."extend",  /*Расширение таблицы*/
      NEW."meta", /*meta*/
       --
      CURRENT_TIMESTAMP /*дата занесения  в эту таблицу */
       );
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION recept_history_f IS 'Создает запись в историю recept_h';

  DROP TRIGGER IF EXISTS recept_history on recept;
  CREATE TRIGGER recept_history
    AFTER INSERT OR UPDATE  ON recept
    FOR EACH ROW
    EXECUTE PROCEDURE recept_history_f();
