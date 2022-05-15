-- table name = operation | таблица: Операции
-- !CREATE EXTENSION IF NOT EXISTS citext; -- установить расширение 
-- ------------------------ история ----------------------------------------------------
-- DROP TABLE IF EXISTS operation_h; -- Удаляем всю иторию, что-бы удалить таблицу
-- --------------------- Таблица ----------------------------------------------------
DROP TABLE IF EXISTS operation CASCADE; 
    CREATE TABLE IF NOT EXISTS operation (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL
    );
      CREATE UNIQUE INDEX operation_name on operation ("name"); 
     -- INSERT INTO operation(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
      COMMENT ON TABLE operation IS 'Операции.';
      COMMENT ON COLUMN operation.name IS 'Наименование';

-- --------------------- история: какое было Наименование на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS operation_h CASCADE;
    CREATE TABLE IF NOT EXISTS operation_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "name" CITEXT default '', /* Наименоване */ 
      "date" TIMESTAMPTZ default CURRENT_TIMESTAMP,
      "meta" jsonb default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      FOREIGN KEY ("id_parent") REFERENCES operation ("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "operation_h_id_parent_date" ON "operation_h" ("id_parent","date");
    COMMENT ON TABLE operation_h IS 'История: Единицы измерения.';
    COMMENT ON COLUMN operation_h.id_parent IS 'ID - таблицы Единицы измерения';
-- ----------------------- Регистр ----------------------------------------------------

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION operation_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO operation_h ("id_parent", "name", "date","meta","deleted","user_id")
         VALUES (NEW."id", NEW."name", CURRENT_TIMESTAMP,NEW."meta",NEW."deleted",NEW."user_id");
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION operation_history_f IS 'Создает запись в историю operation_h';

  DROP TRIGGER IF EXISTS operation_history on operation;
  CREATE TRIGGER operation_history
    AFTER INSERT OR UPDATE  ON operation
    FOR EACH ROW
    EXECUTE PROCEDURE operation_history_f();

-- -------------------  VIEW выборка последних данных  ------------------------------------------------------ 
-- select * from operation_last
DROP VIEW IF EXISTS operation_last;
CREATE VIEW operation_last AS
SELECT * FROM ( -- нам нужна сортировка по другому полю оборачиваем в еще один запрос.
    SELECT DISTINCT ON ("id_parent") -- выбрать только уникальные значения по полю (id_parent) из выборки
    "id_parent",
    "name",
    "date",
    "user_id",
    "meta",
    "deleted"
    FROM operation_h
ORDER BY "id_parent", "date" DESC -- для выборки отсортировать по id_parent, затем по дате в обратном порядке
) AS dist
WHERE "deleted" = 'FALSE'
ORDER BY "name";

-- ----------------------- - - - Данные 
INSERT INTO operation(name) SELECT * FROM unnest('{"Кг.","гр.","Литр.","Тонна"}'::TEXT[]);