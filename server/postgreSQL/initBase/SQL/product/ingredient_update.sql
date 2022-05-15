--DROP FUNCTION ingredient_update;
CREATE
OR REPLACE FUNCTION ingredient_update(
  ida BIGINT,
  products_id1 BIGINT,
  is_raw1 BOOLEAN,
  products_id_child1 BIGINT,
  productraw_id1 BIGINT,
  massbrutto1 NUMERIC,
  massnetto1 NUMERIC,
  massfinish1 NUMERIC,
  description1 CITEXT,
  user_id1 BIGINT,
  user_date1 TIMESTAMPTZ,
  meta1 jsonb -- OUT res RECORD
) RETURNS BIGINT --
AS $BODY$ -- 
DECLARE --
  last_id bigint;

-- _root bigint default 0;
-- _i RECORD;
BEGIN --
  -- ---------------------------- UPDATE ----------------
  IF ida IS NOT NULL THEN
UPDATE productingred
SET products_id = products_id1,
  is_raw = is_raw1,
  products_id_child = products_id_child1,
  productraw_id = productraw_id1,
  massbrutto = massbrutto1,
  massnetto = massnetto1,
  massfinish = massfinish1,
  description = description1,
  user_id = user_id1,
  user_date = user_date1,
  meta = meta1
WHERE id = ida RETURNING id INTO last_id;

END IF;

-- ----------------------------- INSERT --------------------------------
-- ----------------------------  Пересчет ------------------------------
-- пересчитает массу и долю ингредиентов в изменяемом продукте, в допполях сумма по массам для продукта
UPDATE productingred
SET proportion_b = dol.proport,
  sumbrutto = dol.brutto,
  sumnetto = dol.netto,
  sumfinish = dol.finish
FROM (
    SELECT is_raw,
      id,
      products_id,
      products_id_child,
      massbrutto,
      massnetto,
      SUM(massnetto) OVER w AS netto,
      SUM(massbrutto) OVER w AS brutto,
      SUM(massfinish) OVER w AS finish,
      ROUND(
        massbrutto / (SUM(massbrutto) OVER (PARTITION BY products_id)) * 100,
        2
      ) AS proport
    FROM productingred
    WHERE products_id = products_id1 WINDOW w AS (PARTITION BY products_id)
  ) AS dol
WHERE productingred.id = dol.id;

---------  Выход
RETURN last_id;

END;

$BODY$ LANGUAGE 'plpgsql' VOLATILE