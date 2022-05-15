--
-- считаем долю ингредиента в продукте
--

CREATE OR REPLACE FUNCTION f_proportion_massbrutto()
  RETURNS trigger AS
$func$
BEGIN
   IF (TG_OP = 'DELETE') THEN
   -- ------------------------------------ 
    --    UPDATE productingred
    --   SET proportion_b = dol.proport, 
    --       sumbrutto = dol.brutto,
    --       sumnetto = dol.netto,
    --       sumfinish = dol.finish
	  --    FROM (
    --       SELECT is_raw,
		-- 	        id, products_id,products_id_child, 
		-- 	        massbrutto,massnetto,
		-- 			  sum(massnetto) OVER w AS netto,
		-- 			  sum(massbrutto) OVER w AS brutto,
		-- 			  sum(massfinish) OVER w AS finish,
		--            ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
    --         FROM   productingred
    --         where  products_id = OLD.products_id
    --         WINDOW w AS (partition BY products_id)
	  --        ) AS dol
    --   WHERE productingred.id = dol.id;  
		
		-- UPDATE productingred
		-- SET massnetto = child.sumnetto,
		-- massbrutto = child.sumbrutto,
		-- massfinish = child.sumfinish
		-- FROM  (SELECT DISTINCT ON (products_id) * FROM productingred
		--        WHERE products_id = OLD.products_id 
		--        ) AS child
		-- WHERE productingred.products_id_child = child.products_id;
--------------------------
  --     UPDATE productingred
  --     SET proportion_b = dol.proport
  --     FROM  (
  --       SELECT products_id,massbrutto,ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
  --       FROM   productingred
  --       where  products_id = OLD.products_id
  --       --! рассмотреть FOR UPDATE  не совместимо с оконными функциясм!
  --       ) AS dol
  --     WHERE OLD.products_id = dol.products_id AND productingred.massbrutto = dol.massbrutto; 
  -- -- -- 
  --   UPDATE products
  --       SET  massbrutto = n.massbrutto,
  --            massnetto = n.massnetto,
	--     	 massfinish = n.massfinish 
  --       FROM  (
  --       SELECT sum(massbrutto) AS massbrutto,sum(massnetto) AS massnetto ,sum(massfinish) AS massfinish FROM productingred
  --      WHERE products_id = OLD.products_id 
  --       ) n 
  --   WHERE  products.id = OLD.products_id;
  -- ----------------------------- 
   ELSEIF (TG_OP = 'UPDATE') THEN  -- НЕ DELETE
       UPDATE productingred
      SET proportion_b = dol.proport, 
          sumbrutto = dol.brutto,
          sumnetto = dol.netto,
          sumfinish = dol.finish
	     FROM (
          SELECT is_raw,
			        id, products_id,products_id_child, 
			        massbrutto,massnetto,
					  sum(massnetto) OVER w AS netto,
					  sum(massbrutto) OVER w AS brutto,
					  sum(massfinish) OVER w AS finish,
		           ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
            FROM   productingred
            where  products_id = NEW.products_id
            WINDOW w AS (partition BY products_id)
	         ) AS dol
      WHERE productingred.id = dol.id;-- AND productingred.massbrutto = dol.massbrutto;  
		
     
    
  WITH updated AS (
		UPDATE productingred
		SET massnetto = child.sumnetto,
		massbrutto = child.sumbrutto,
		massfinish = child.sumfinish,
    tr = TRUE
		FROM  (SELECT DISTINCT ON (products_id) * FROM productingred
		       WHERE products_id = NEW.products_id 
		       ) AS child
		WHERE productingred.products_id_child = child.products_id
    RETURNING productingred.id
    )
    UPDATE productingred SET tr = FALSE WHERE productingred.id in ( select id from updated);
   END IF;

    ----------------------------------
    --   UPDATE productingred
    --   SET proportion_b = dol.proport
    --   FROM  (
    --     SELECT products_id,massbrutto,ROUND( massbrutto /  (sum(massbrutto) OVER (partition BY products_id)) * 100, 2) AS proport
    --     FROM   productingred
    --     where  products_id = NEW.products_id
    --     --! рассмотреть FOR UPDATE  не совместимо с оконными функциясм!
    --     ) AS dol
    --   WHERE NEW.products_id = dol.products_id AND productingred.massbrutto = dol.massbrutto;
    -- END IF;
    --  -- --- Обновляем данные ПФ в таблице Продукты
    --   -- RAISE NOTICE ' update products %',NEW.products_id;
    --   UPDATE products
    --     SET  massbrutto = n.massbrutto,
    --          massnetto = n.massnetto,
	  --   	 massfinish = n.massfinish 
    --     FROM  (
    --     SELECT sum(massbrutto) AS massbrutto,sum(massnetto) AS massnetto ,sum(massfinish) AS massfinish FROM productingred
    --    WHERE products_id = NEW.products_id 
    --     ) n 
    --   WHERE  products.id = NEW.products_id;
  -- --------------------------------------
  RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS proportion_massbrutto ON productingred;
CREATE TRIGGER proportion_massbrutto
  AFTER UPDATE OF massbrutto, massnetto, massfinish ON productingred  -- реагируем только на massbrutto и НЕ меняем в функции поле massbrutto 
  FOR EACH ROW  --STATEMENT
  EXECUTE PROCEDURE f_proportion_massbrutto();

DROP TRIGGER IF EXISTS proportion_massbrutto_del ON productingred;
-- CREATE TRIGGER proportion_massbrutto_del
--   AFTER DELETE ON productingred  --  
--   FOR EACH ROW
--   EXECUTE PROCEDURE f_proportion_massbrutto();