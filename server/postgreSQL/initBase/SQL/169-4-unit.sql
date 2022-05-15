-- table name = unit | таблица: Единицы измерения
-- !CREATE EXTENSION IF NOT EXISTS citext; -- установить расширение 
-- ------------------------ история ----------------------------------------------------
-- DROP TABLE IF EXISTS unit_h; -- Удаляем всю иторию, что-бы удалить таблицу
-- --------------------- Таблица ----------------------------------------------------
DROP TABLE IF EXISTS unit CASCADE; 
    CREATE TABLE IF NOT EXISTS unit (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "name_ext" CITEXT DEFAULT '',
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
      CREATE UNIQUE INDEX unit_name on unit ("name"); 
     -- INSERT INTO unit(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
      COMMENT ON TABLE unit IS 'Единицы измерения.';
      COMMENT ON COLUMN unit.name IS 'Наименование';

-- --------------------- история: какое было Наименование на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS unit_h CASCADE;
    CREATE TABLE IF NOT EXISTS unit_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "name" CITEXT default '', /* Наименоване */ 
      "name_ext" CITEXT DEFAULT '',
      "meta" jsonb default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT,
      "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "date_h" TIMESTAMPTZ default CURRENT_TIMESTAMP,
      FOREIGN KEY ("id_parent") REFERENCES unit ("id") ON DELETE CASCADE
    );
    COMMENT ON TABLE unit_h IS 'История: Единицы измерения.';
    COMMENT ON COLUMN unit_h.id_parent IS 'ID - таблицы Единицы измерения';
-- ----------------------- Регистр ----------------------------------------------------

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION unit_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO unit_h (
        "id_parent", -- !!!!! parent
        "name", /* Наименоване */ 
        "name_ext",
        "meta",
        "deleted",
        "user_id",
        "user_date",
        "date_h"
          )
         VALUES (
         NEW."id",
         NEW."name", /* Наименоване */ 
         NEW."name_ext",
         NEW."meta",
         NEW."deleted",
         NEW."user_id",
         NEW."user_date",
         CURRENT_TIMESTAMP
           );
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION unit_history_f IS 'Создает запись в историю unit_h';

  DROP TRIGGER IF EXISTS unit_history on unit;
  CREATE TRIGGER unit_history
    AFTER INSERT OR UPDATE  ON unit
    FOR EACH ROW
    EXECUTE PROCEDURE unit_history_f();

-- -------------------  VIEW выборка последних данных  ------------------------------------------------------ 
-- select * from unit_last
DROP VIEW IF EXISTS unit_last;
CREATE VIEW unit_last AS
SELECT * FROM ( -- нам нужна сортировка по другому полю оборачиваем в еще один запрос.
    SELECT DISTINCT ON ("id_parent") -- выбрать только уникальные значения по полю (id_parent) из выборки
    id_parent,
    "name",
    "date_h",
    "user_id",
    "meta",
    "deleted"
    FROM unit_h
ORDER BY "id_parent", "date_h" DESC -- для выборки отсортировать по id_parent, затем по дате в обратном порядке
) AS dist
WHERE "deleted" = 'FALSE'
ORDER BY "name";

-- ----------------------- - - - Данные 
INSERT INTO unit(name) SELECT * FROM unnest('{"Кг.","гр.","Литр.","Тонна"}'::TEXT[]);