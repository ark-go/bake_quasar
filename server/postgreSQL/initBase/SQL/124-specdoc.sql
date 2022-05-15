-- table: specdoc
-- Спецификация магазинов (1): документ
-- Дата старта, документа,  очищается от времени триггером
-- На магазин можно записать только один документ на дату
-- На магазин может быть только один уникальный номер документа
-- Нельзя удалить магазин из store если тут есть из него документы

DROP TABLE IF EXISTS specdoc CASCADE;
    CREATE TABLE IF NOT EXISTS specdoc (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик id
      store_id BIGINT NOT NULL,          /* ссылка на магазин */
      date_start TIMESTAMPTZ NOT NULL,     /* дата вступления документа */
      doc_number CITEXT default '',      /* номер документа*/
      doc_vhod_number CITEXT default '', /* входящий номер */ 
      prim CITEXT default '',            /* Примечание */
      meta jsonb default '{}'::jsonb,
      user_id BIGINT NOT NULL,           /* наш пользователь*/
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, /* дата занесения - изменения*/
      FOREIGN KEY (store_id) REFERENCES store ("id") ON DELETE RESTRICT,
      FOREIGN KEY (user_id) REFERENCES users ("id") ON DELETE RESTRICT
    );
   CREATE UNIQUE INDEX "IDX_specdoc_store_date" ON "specdoc" (store_id,date_start);
   CREATE UNIQUE INDEX "IDX_specdoc_store_date" ON "specdoc" (store_id,doc_number);
   CREATE INDEX specdoc_idx_date ON specdoc (date_start);
   
 CREATE OR REPLACE FUNCTION specdoc_ins_upd()  RETURNS TRIGGER AS
     -- Убираем время из DATESTAMPTZ
     $BODY$
     BEGIN
       -- IF ( TG_OP = 'INSERT' ) THEN
       -- END IF;
        NEW.date_start = CAST(CAST(NEW.date_start AS DATE) AS TIMESTAMPTZ);
       -- если хоть чтото изменилось вызовется функция, или отдельное поле указать
       -- WHEN (OLD.* IS DISTINCT FROM NEW.*)
        RETURN NEW;
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS specdoc_ins_upd ON specdoc RESTRICT;
  CREATE TRIGGER specdoc_ins_upd
     BEFORE INSERT OR UPDATE ON specdoc
     FOR EACH ROW EXECUTE PROCEDURE specdoc_ins_upd();