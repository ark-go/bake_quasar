/*
bakehouses_history_admin
-- триггер сработает на вставку нового и обновлении старого значения admin_id ID администратора
-- в таблицу historybakeadmin будет записана новая запись с текущей датой (дата автоматически вставляется)
-- если надо будет менять дату. хз...
CREATE OR REPLACE FUNCTION bakehouses_history_admin_f()  RETURNS TRIGGER AS
     $BODY$
     BEGIN
	
       IF ( TG_OP = 'INSERT' ) THEN
	     INSERT INTO historybakeadmin (id_bake, id_user, adm_date)
         VALUES (NEW.id, NEW.admin_id, CURRENT_TIMESTAMP::DATE);
       END IF;
	   IF ( TG_OP = 'UPDATE' ) THEN
     	   if OLD.admin_id <> NEW.admin_id THEN
	         INSERT INTO historybakeadmin (id_bake, id_user, adm_date)
              VALUES (NEW.id, NEW.admin_id, CURRENT_TIMESTAMP::DATE);
		   end if;
       END IF;
        -- - NEW.email = LOWER(NEW.email);
       -- если хоть чтото изменилось вызовется функция, или отдельное поле указать
       -- WHEN (OLD.* IS DISTINCT FROM NEW.*)
        RETURN NEW;
	 	
     END ;
     $BODY$ 
     LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS bakehouses_history_admin on bakehouses;
  CREATE TRIGGER bakehouses_history_admin
    AFTER INSERT OR UPDATE OF admin_id ON bakehouses
    FOR EACH ROW
    -- WHEN (OLD.admin_id IS DISTINCT FROM NEW.admin_id)
    EXECUTE PROCEDURE bakehouses_history_admin_f();
*/