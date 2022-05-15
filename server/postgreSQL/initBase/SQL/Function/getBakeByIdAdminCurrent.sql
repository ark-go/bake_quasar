/*
-- select * from getBakeByIdAdminCurrent( IdAdmin)
-- получает все последние пекарни админа их может много по ID админа их датами назначения
-- последние значит покажет только текушие, в отличие от (getBakeByIdAdmin оно выдаст даже если там новый админ)
DROP FUNCTION IF EXISTS getBakeByIdAdminCurrent;
    CREATE FUNCTION getBakeByIdAdminCurrent(idAdmin BIGINT)
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
      select bid.id_bake,bid.id_user,bid.adm_date,bid.meta from getBakeByIdAdmin(IdAdmin) as bid ,getBakeAdminLast() as bal 
      where bid.id_bake = bal.id_bake AND bid.id_user = bal.id_user
	) as lastadmin
 ON allbake.adm_date = lastadmin.adm_date AND allbake.id_bake = lastadmin.id_bake;
--
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
*/
/*

SELECT * FROM (SELECT id_bake, id_user,max(adm_date) as adm_date FROM historybakeadmin
   WHERE  id_bake=2 AND adm_date <= '23.05.2022'::DATE
   GROUP BY id_bake,id_user
  ) AS maxdate
ORDER BY adm_date DESC
LIMIT 1
*/