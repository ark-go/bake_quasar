-- ---------------------- Запрет удаления и изменения  рецепта если он использовался ------------------------
CREATE OR REPLACE FUNCTION f_no_delete_ingredient()
  RETURNS trigger AS
$func$
DECLARE 
      tmp BIGINT;
BEGIN
     -- в рецептах не должно быть строки у которой в products_id_child  и пропустить саму себя
        SELECT count(*) INTO tmp FROM productingred as prod
        where OLD.products_id = prod.products_id_child AND OLD.products_id <> prod.products_id;
        --where OLD.products_id in ( select products_id_child from productingred);
       
        -- LEFT JOIN productingred as sub ON prod.id = sub.id
        -- where  prod.products_id_child = sub.id;
        --where products_id_child in ( select id from productingred);

       -- WHERE products_id = products_id_child; -- AND productingred.id <> OLD.id;
        RAISE EXCEPTION 'Ингедиент нельзя удалить и изменить, он уже используется %', tmp;
       IF tmp > 0 THEN
         RAISE EXCEPTION 'Ингедиент нельзя удалить и изменить, он уже используется';
       END IF;
  RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS no_delete_ingredient ON productingred;
CREATE TRIGGER no_delete_ingredient
  BEFORE INSERT OR UPDATE OR DELETE ON productingred  --
  FOR EACH ROW
  EXECUTE PROCEDURE f_no_delete_ingredient();
