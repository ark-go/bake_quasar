--DROP FUNCTION ingredient_check_finish_only;
CREATE
OR REPLACE FUNCTION ingredient_check_finish_only(OL productingred, NE productingred) -- product_id
RETURNS BOOLEAN LANGUAGE 'plpgsql' VOLATILE AS $BODY$
BEGIN RETURN CASE
        WHEN OL .is_raw <> NE .is_raw THEN FALSE
        WHEN OL .products_id_child <> NE .products_id_child THEN FALSE
        WHEN OL .productraw_id <> NE .productraw_id THEN FALSE
        WHEN OL .massbrutto <> NE .massbrutto THEN FALSE
        WHEN OL .massnetto <> NE .massnetto THEN FALSE
        ELSE TRUE
    END;

END;

$BODY$