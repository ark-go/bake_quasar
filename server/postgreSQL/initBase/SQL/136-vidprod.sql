-- table name = vidprod | таблица: Вид продукта
-- !CREATE EXTENSION IF NOT EXISTS citext; -- установить расширение 
-- ------------------------ история ----------------------------------------------------
-- DROP TABLE IF EXISTS vidprod_h; -- Удаляем всю иторию, что-бы удалить таблицу
-- --------------------- Таблица ----------------------------------------------------
DROP TABLE IF EXISTS vidprod CASCADE; 
    CREATE TABLE IF NOT EXISTS vidprod (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL
    );
      CREATE UNIQUE INDEX vidprod_name on vidprod ("name"); 
     -- INSERT INTO vidprod(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
      COMMENT ON TABLE vidprod IS 'Единицы измерения.';
      COMMENT ON COLUMN vidprod.name IS 'Наименование';

-- --------------------- история: какое было Наименование на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS vidprod_h CASCADE;
    CREATE TABLE IF NOT EXISTS vidprod_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "name" CITEXT default '', /* Наименоване */ 
      "date" TIMESTAMPTZ default CURRENT_TIMESTAMP,
      "meta" jsonb default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      FOREIGN KEY ("id_parent") REFERENCES vidprod ("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "vidprod_h_id_parent_date" ON "vidprod_h" ("id_parent","date");
    COMMENT ON TABLE vidprod_h IS 'История: Единицы измерения.';
    COMMENT ON COLUMN vidprod_h.id_parent IS 'ID - таблицы Единицы измерения';
-- ----------------------- Регистр ----------------------------------------------------

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION vidprod_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO vidprod_h ("id_parent", "name", "date","meta","deleted","user_id")
         VALUES (NEW."id", NEW."name", CURRENT_TIMESTAMP,NEW."meta",NEW."deleted",NEW."user_id");
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION vidprod_history_f IS 'Создает запись в историю vidprod_h';

  DROP TRIGGER IF EXISTS vidprod_history on vidprod;
  CREATE TRIGGER vidprod_history
    AFTER INSERT OR UPDATE  ON vidprod
    FOR EACH ROW
    EXECUTE PROCEDURE vidprod_history_f();

-- -------------------  VIEW выборка последних данных  ------------------------------------------------------ 
-- select * from vidprod_last
DROP VIEW IF EXISTS vidprod_last;
CREATE VIEW vidprod_last AS
SELECT * FROM ( -- нам нужна сортировка по другому полю оборачиваем в еще один запрос.
    SELECT DISTINCT ON ("id_parent") -- выбрать только уникальные значения по полю (id_parent) из выборки
    "id_parent",
    "name",
    "date",
    "user_id",
    "meta",
    "deleted"
    FROM vidprod_h
ORDER BY "id_parent", "date" DESC -- для выборки отсортировать по id_parent, затем по дате в обратном порядке
) AS dist
WHERE "deleted" = 'FALSE'
ORDER BY "name";

-- ----------------------- - - - Данные 
-- INSERT INTO vidprod(name) SELECT * FROM unnest('{"Кг.","гр.","Литр.","Тонна"}'::TEXT[]);