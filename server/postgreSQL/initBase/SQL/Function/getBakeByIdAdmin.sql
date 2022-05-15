/*
-- select * from getBakeByIdAdmin( IdAdmin)
-- получить все последние пекарни админа их может много по ID админа их датами назначения
-- последние не означают текущие, там может быть уже новый админ
DROP FUNCTION IF EXISTS getBakeByIdAdmin;
    CREATE FUNCTION getBakeByIdAdmin(idAdmin BIGINT)
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
   WHERE historybakeadmin.id_user = IdAdmin
   GROUP BY historybakeadmin.id_bake
	) as lastadmin
 ON allbake.adm_date = lastadmin.adm_date AND allbake.id_bake = lastadmin.id_bake;
--
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
*/