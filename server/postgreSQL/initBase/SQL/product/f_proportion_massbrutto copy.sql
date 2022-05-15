--
-- считаем долю ингредиента в продукте
--

CREATE OR REPLACE FUNCTION f_proportion_massbrutto()
  RETURNS trigger AS
$func$
BEGIN
   IF (TG_OP = 'DELETE') THEN
   -- ------------------------------------ 
      UPDATE productingred
      SET proportion_b = dol.proport
      FROM  (
        SELECT products_id,massbrutto,ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
        FROM   productingred
        where  products_id = OLD.products_id
        --! рассмотреть FOR UPDATE  не совместимо с оконными функциясм!
        ) AS dol
      WHERE OLD.products_id = dol.products_id AND productingred.massbrutto = dol.massbrutto; 
  -- -- 
    UPDATE products
        SET  massbrutto = n.massbrutto,
             massnetto = n.massnetto,
	    	 massfinish = n.massfinish 
        FROM  (
        SELECT sum(massbrutto) AS massbrutto,sum(massnetto) AS massnetto ,sum(massfinish) AS massfinish FROM productingred
       WHERE products_id = OLD.products_id 
        ) n 
    WHERE  products.id = OLD.products_id;
  -- ----------------------------- 
   ELSE  -- НЕ DELETE
      UPDATE productingred
      SET proportion_b = dol.proport
      FROM  (
        SELECT products_id,massbrutto,ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
        FROM   productingred
        where  products_id = NEW.products_id
        --! рассмотреть FOR UPDATE  не совместимо с оконными функциясм!
        ) AS dol
      WHERE NEW.products_id = dol.products_id AND productingred.massbrutto = dol.massbrutto;
    END IF;
  -- --- Обновляем данные ПФ в таблице Продукты
      UPDATE products
        SET  massbrutto = n.massbrutto,
             massnetto = n.massnetto,
	    	 massfinish = n.massfinish 
        FROM  (
        SELECT sum(massbrutto) AS massbrutto,sum(massnetto) AS massnetto ,sum(massfinish) AS massfinish FROM productingred
       WHERE products_id = NEW.products_id 
        ) n 
      WHERE  products.id = NEW.products_id;
  -- --- 
    --  UPDATE productingred
    --     SET  massbrutto = n.massbrutto,
    --          massnetto = n.massnetto,
	  --   	 massfinish = n.massfinish 
    --     FROM  (
    --     SELECT sum(massbrutto) AS massbrutto,sum(massnetto) AS massnetto ,sum(massfinish) AS massfinish FROM productingred
    --    WHERE products_id = NEW.products_id 
    --     ) n 
    --   WHERE  productingred.products_id_child = NEW.products_id -- зацикл
            --AND (productingred.id <> NEW.id;
   -- END IF;

  -- --------------------------------------
  RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS proportion_massbrutto ON productingred;
-- CREATE TRIGGER proportion_massbrutto
--   AFTER INSERT OR UPDATE OF massbrutto, massnetto, massfinish ON productingred  -- реагируем только на massbrutto и НЕ меняем в функции поле massbrutto 
--   FOR EACH ROW
--   EXECUTE PROCEDURE f_proportion_massbrutto();

DROP TRIGGER IF EXISTS proportion_massbrutto_del ON productingred;
-- CREATE TRIGGER proportion_massbrutto_del
--   AFTER DELETE ON productingred  --  
--   FOR EACH ROW
--   EXECUTE PROCEDURE f_proportion_massbrutto();