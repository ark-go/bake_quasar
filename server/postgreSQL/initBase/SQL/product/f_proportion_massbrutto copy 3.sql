--
-- считаем долю ингредиента в продукте
--
CREATE
OR REPLACE FUNCTION f_proportion_massbrutto() RETURNS TRIGGER AS $func$
BEGIN IF (TG_OP = 'DELETE') THEN PERFORM ingredient_recalc(OLD .products_id);

ELSIF (TG_OP = 'UPDATE')
OR (TG_OP = 'INSERT') THEN PERFORM ingredient_recalc(NEW .products_id);

END IF;

RETURN NEW;

END $func$ LANGUAGE plpgsql;
-- -----------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS proportion_massbrutto ON productingred;

CREATE TRIGGER proportion_massbrutto AFTER
DELETE
  OR
INSERT
  OR
UPDATE OF massbrutto,
  massnetto,
  massfinish ON productingred -- реагируем только на massbrutto и НЕ меняем в функции поле massbrutto 
  FOR EACH ROW --STATEMENT
  EXECUTE PROCEDURE f_proportion_massbrutto();

--DROP TRIGGER IF EXISTS proportion_massbrutto_del ON productingred;
--DROP TRIGGER IF EXISTS no_delete_ingredient ON productingred;
--DROP FUNCTION IF EXISTS f_no_delete_ingredient();
-- CREATE TRIGGER proportion_massbrutto_del
--   AFTER DELETE ON productingred  --  
--   FOR EACH ROW
--   EXECUTE PROCEDURE f_proportion_massbrutto();