-- table name = bludo | таблица: Вид продукта
-- !CREATE EXTENSION IF NOT EXISTS citext; -- установить расширение 
-- ------------------------ история ----------------------------------------------------
-- DROP TABLE IF EXISTS bludo_h; -- Удаляем всю иторию, что-бы удалить таблицу
-- --------------------- Таблица ----------------------------------------------------
DROP TABLE IF EXISTS bludo CASCADE; 
    CREATE TABLE IF NOT EXISTS bludo (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "name" CITEXT NOT NULL UNIQUE, /*Наименование*/ /*REFERENCES Customers (Id),*/
      "meta" jsonb NOT NULL default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL
    );
      CREATE UNIQUE INDEX bludo_name on bludo ("name"); 
     -- INSERT INTO bludo(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
      COMMENT ON TABLE bludo IS 'Блюда.';
      COMMENT ON COLUMN bludo.name IS 'Наименование';

-- --------------------- история: какое было Наименование на дату -----------------
-- Привязываем к основной таблице, при удалении записи в основной, удаляется вся история о ней
DROP TABLE IF EXISTS bludo_h CASCADE;
    CREATE TABLE IF NOT EXISTS bludo_h (
      "id" BIGSERIAL PRIMARY KEY,  -- счетчик
      "id_parent" BIGINT NOT NULL, -- !!!!! parent
      "name" CITEXT default '', /* Наименоване */ 
      "date" TIMESTAMPTZ default CURRENT_TIMESTAMP,
      "meta" jsonb default '{}'::jsonb,
      "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "user_id" BIGINT DEFAULT NULL,
      FOREIGN KEY ("id_parent") REFERENCES bludo ("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "bludo_h_id_parent_date" ON "bludo_h" ("id_parent","date");
    COMMENT ON TABLE bludo_h IS 'История: Единицы измерения.';
    COMMENT ON COLUMN bludo_h.id_parent IS 'ID - таблицы Единицы измерения';
-- ----------------------- Регистр ----------------------------------------------------

-- триггер сработает на вставку нового и обновлении старого значения - "name"
-- в таблицу xxxx_h будет записана новая запись с текущей датой (дата автоматически вставляется)

CREATE OR REPLACE FUNCTION bludo_history_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
     	 INSERT INTO bludo_h ("id_parent", "name", "date","meta","deleted","user_id")
         VALUES (NEW."id", NEW."name", CURRENT_TIMESTAMP,NEW."meta",NEW."deleted",NEW."user_id");
         RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
 COMMENT ON FUNCTION bludo_history_f IS 'Создает запись в историю bludo_h';

  DROP TRIGGER IF EXISTS bludo_history on bludo;
  CREATE TRIGGER bludo_history
    AFTER INSERT OR UPDATE  ON bludo
    FOR EACH ROW
    EXECUTE PROCEDURE bludo_history_f();

-- -------------------  VIEW выборка последних данных  ------------------------------------------------------ 
-- select * from bludo_last
DROP VIEW IF EXISTS bludo_last;
CREATE VIEW bludo_last AS
SELECT * FROM ( -- нам нужна сортировка по другому полю оборачиваем в еще один запрос.
    SELECT DISTINCT ON ("id_parent") -- выбрать только уникальные значения по полю (id_parent) из выборки
    "id_parent",
    "name",
    "date",
    "user_id",
    "meta",
    "deleted"
    FROM bludo_h
ORDER BY "id_parent", "date" DESC -- для выборки отсортировать по id_parent, затем по дате в обратном порядке
) AS dist
WHERE "deleted" = 'FALSE'
ORDER BY "name";

-- ----------------------- - - - Данные 
-- INSERT INTO bludo(name) SELECT * FROM unnest('{"Кг.","гр.","Литр.","Тонна"}'::TEXT[]);