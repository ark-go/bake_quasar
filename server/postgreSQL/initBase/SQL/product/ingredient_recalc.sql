-- DROP FUNCTION ingredient_recalc(prod_id NUMERIC);
-- Делает пересчет сумм и доли указанного продукта в таблице productingred
-- возвращает суммы брутто нетто финиш для продукта
CREATE
OR REPLACE FUNCTION ingredient_recalc(prod_id NUMERIC) -- product_id
RETURNS TABLE (
    sumbrutto NUMERIC,
    sumnetto NUMERIC,
    sumfinish NUMERIC
) AS $BODY$
BEGIN
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
        WHERE products_id = prod_id WINDOW w AS (PARTITION BY products_id)
    ) AS dol
WHERE productingred.id = dol.id;

-- выделяем и возвращаем  одну строку чтоб забрать суммы , для родителя
RETURN query
SELECT DISTINCT ON(products_id) pd.sumbrutto,
    pd.sumnetto,
    pd.sumfinish
FROM productingred AS pd
WHERE products_id = prod_id;

END;

$BODY$ LANGUAGE 'plpgsql' VOLATILE