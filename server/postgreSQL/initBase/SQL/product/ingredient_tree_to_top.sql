DROP FUNCTION ingredient_tree_to_top(prod_id NUMERIC);

-- Делает пересчет сумм и доли указанного продукта в таблице productingred
-- возвращает суммы брутто нетто финиш для продукта
CREATE
OR REPLACE FUNCTION ingredient_tree_to_top(prod_id NUMERIC) -- product_id
RETURNS TABLE(
    id BIGINT,
    products_id BIGINT,
    products_id_child BIGINT,
    is_raw BOOLEAN,
    LEVEL INT
) AS $BODY$
BEGIN RETURN query WITH RECURSIVE r AS (
        SELECT pd.id,
            pd.products_id,
            pd.products_id_child,
            pd.is_raw,
            1 AS LEVEL
        FROM productingred pd
        WHERE pd.products_id = prod_id -- 96   
            -- WHERE products_id_child = 96 --155    
        UNION
        SELECT pr.id,
            pr.products_id,
            pr.products_id_child,
            pr.is_raw,
            r.level + 1 AS LEVEL
        FROM productingred pr
            JOIN r ON r.products_id = pr.products_id_child
    )
SELECT DISTINCT ON(LEVEL, products_id) *
FROM r
ORDER BY LEVEL,
    products_id;

RETURN;

-- NEXT --ORDER BY LEVEL;
--    RETURN ;
END;

$BODY$ LANGUAGE 'plpgsql' VOLATILE