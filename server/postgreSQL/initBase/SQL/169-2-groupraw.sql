-- table name = groupraw | таблица: Группы сырья
-- !CREATE EXTENSION IF NOT EXISTS citext; -- установить расширение 
-- ------------------------ история ----------------------------------------------------
-- DROP TABLE IF EXISTS groupraw_h; -- Удаляем всю иторию, что-бы удалить таблицу
-- --------------------- Таблица ----------------------------------------------------
DROP TABLE IF EXISTS groupraw CASCADE; 
    CREATE TABLE IF NOT EXISTS groupraw (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "name_ext" CITEXT DEFAULT '',
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      CREATE UNIQUE INDEX groupraw_name on groupraw ("name"); 
     -- INSERT INTO groupraw(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
      COMMENT ON TABLE groupraw IS 'Группа сырья.';
      COMMENT ON COLUMN groupraw.name IS 'Наименование';

-- --------------------- история: какое было Наименование на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS groupraw_h CASCADE;
    CREATE TABLE IF NOT EXISTS groupraw_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "name" CITEXT default '', /* Наименоване */ 
      "name_ext" CITEXT DEFAULT '',
      "date" TIMESTAMPTZ default CURRENT_TIMESTAMP,
      "meta" jsonb default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("id_parent") REFERENCES groupraw ("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "groupraw_h_id_parent_date" ON "groupraw_h" ("id_parent","date");
    COMMENT ON TABLE groupraw_h IS 'История: Единицы измерения.';
    COMMENT ON COLUMN groupraw_h.id_parent IS 'ID - таблицы Единицы измерения';
-- ----------------------- Регистр ----------------------------------------------------

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION groupraw_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO groupraw_h ("id_parent", "name","name_ext", "date","meta","deleted","user_id","user_date")
         VALUES (NEW."id", NEW."name",NEW."name_ext", CURRENT_TIMESTAMP,NEW."meta",NEW."deleted",NEW."user_id",NEW."user_date");
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION groupraw_history_f IS 'Создает запись в историю groupraw_h';

  DROP TRIGGER IF EXISTS groupraw_history on groupraw;
  CREATE TRIGGER groupraw_history
    AFTER INSERT OR UPDATE  ON groupraw
    FOR EACH ROW
    EXECUTE PROCEDURE groupraw_history_f();

-- -------------------  VIEW выборка последних данных  ------------------------------------------------------ 
-- select * from groupraw_last
DROP VIEW IF EXISTS groupraw_last;
CREATE VIEW groupraw_last AS
SELECT * FROM ( -- нам нужна сортировка по другому полю оборачиваем в еще один запрос.
    SELECT DISTINCT ON ("id_parent") -- выбрать только уникальные значения по полю (id_parent) из выборки
    "id_parent",
    "name",
    "date",
    "user_id",
    "meta",
    "deleted"
    FROM groupraw_h
ORDER BY "id_parent", "date" DESC -- для выборки отсортировать по id_parent, затем по дате в обратном порядке
) AS dist
WHERE "deleted" = 'FALSE'
ORDER BY "name";

-- ----------------------- - - - Данные 
-- INSERT INTO groupraw(name) SELECT * FROM unnest('{"Кг.","гр.","Литр.","Тонна"}'::TEXT[]);