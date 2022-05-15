 -- -- - -- - - - - - - - ----------------
 CREATE OR REPLACE FUNCTION FN_kagentvidreg_default_nodelete()
  RETURNS TRIGGER AS $$
BEGIN
  IF OLD.meta ->>'system_select' = 'true'
     THEN
        RAISE EXCEPTION 'Нельзя удалить значение по умолчанию!';
     END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
--- -----------------------
    DROP TRIGGER IF EXISTS kagentvidreg_default_nodelete on kagentvidreg;
      CREATE TRIGGER kagentvidreg_default_nodelete
      BEFORE DELETE ON kagentvidreg
      FOR EACH ROW
    -- WHEN (OLD.admin_id IS DISTINCT FROM NEW.admin_id)
      EXECUTE PROCEDURE FN_kagentvidreg_default_nodelete();