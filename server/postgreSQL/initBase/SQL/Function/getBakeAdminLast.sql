/*
-- select * from getBakeAdminLast()
-- получить все ID пекарни с последними ID админов там и их датами назначения
DROP FUNCTION IF EXISTS getBakeAdminLast;
    CREATE FUNCTION getBakeAdminLast()
     RETURNS TABLE (
		id_bake BIGINT,
		id_user BIGINT,
		adm_date TIMESTAMPTZ,
		meta JSONB -- дополнения от базы истории дат
	 )
	  AS
$BODY$
    BEGIN
--	
RETURN QUERY select allbake.id_bake,allbake.id_user,allbake.adm_date, allbake.meta from historybakeadmin as allbake
 INNER  JOIN (
   SELECT historybakeadmin.id_bake, max(historybakeadmin.adm_date) as adm_date FROM historybakeadmin
   GROUP BY historybakeadmin.id_bake
	) as lastadmin
 ON allbake.adm_date = lastadmin.adm_date;
--
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
*/