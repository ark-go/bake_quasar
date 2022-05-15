UPDATE productingred
SET sumbrutto = up.brutto2,
    sumnetto = up.netto2,
    sumfinish = up.finish2,
    proportion_b = up.proport
FROM (
        SELECT ssum.id,
            SUM(massbrutto) OVER w AS brutto2,
            SUM(massnetto) OVER w AS netto2,
            SUM(massfinish) OVER w AS finish2,
            ROUND(
                massbrutto / (SUM(massbrutto) OVER (PARTITION BY products_id)) * 100,
                2
            ) AS proport
        FROM productingred AS ssum --   WHERE products_id IN (SELECT products_id FROM r)
            WINDOW w AS (PARTITION BY ssum.products_id)
    ) up
WHERE productingred.id = up.id