CREATE OR REPLACE FUNCTION FN_kagent_default_null()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vidreg_id IS NULL
  THEN
     NEW.vidreg_id = (SELECT id FROM kagentvidreg
               WHERE meta ->>'system_select' = 'true'
               LIMIT 1);
     IF NEW.vidreg_id IS NULL THEN
         RAISE EXCEPTION 'Не найден "Вид регистрации" по умолчанию!';
     END IF; 
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--- -----------------------
    DROP TRIGGER IF EXISTS kagent_default_null on kagent;
      CREATE TRIGGER kagent_default_null
      BEFORE INSERT OR UPDATE OF vidreg_id ON kagent
      FOR EACH ROW
    -- WHEN (OLD.admin_id IS DISTINCT FROM NEW.admin_id)
      EXECUTE PROCEDURE FN_kagent_default_null();

 -- -- - -- - - - - - - - ----------------
 CREATE OR REPLACE FUNCTION FN_kagent_default_nodelete()
  RETURNS TRIGGER AS $$
BEGIN
  IF OLD.meta ->> 'system_select' = 'true'
     THEN
        RAISE EXCEPTION 'Нельзя удалить значение по умолчанию!';
     END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
--- -----------------------
    DROP TRIGGER IF EXISTS kagent_default_nodelete on kagent;
      CREATE TRIGGER kagent_default_nodelete
      BEFORE DELETE ON kagent
      FOR EACH ROW
    -- WHEN (OLD.admin_id IS DISTINCT FROM NEW.admin_id)
      EXECUTE PROCEDURE FN_kagent_default_nodelete();