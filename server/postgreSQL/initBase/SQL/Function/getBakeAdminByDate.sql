/*
-- select * from getBakeAdminByDate(2,'19.02.2022')
-- Получить админа по дате для пекарни
-- группируем  пекарню+админ  выделяем максимальные даты
-- сортируем от большего числа и берем первое
-- это будет ближайшее предыдущее или этоже число назначения в пекарню админа
-- этого админа мы и выдаем с числом назначения
DROP FUNCTION IF EXISTS getBakeAdminByDate;
    CREATE FUNCTION getBakeAdminByDate( idBake BIGINT,admDate TIMESTAMPTZ)
    -- RETURNS SETOF g_childs
     RETURNS TABLE (
		id_bake BIGINT,
		id_user BIGINT,
		adm_date TIMESTAMPTZ
	 )
	  AS
$BODY$
    BEGIN
-- выдает ID админа в последнюю ближайшую дату к заданной, и по id пекарни  
   RETURN QUERY SELECT * FROM (SELECT historybakeadmin.id_bake, historybakeadmin.id_user,max(historybakeadmin.adm_date) as adm_date FROM historybakeadmin
   WHERE  historybakeadmin.id_bake=idBake AND historybakeadmin.adm_date <= admDate::DATE
   GROUP BY historybakeadmin.id_bake,historybakeadmin.id_user
  ) AS maxdate
ORDER BY maxdate.adm_date DESC
LIMIT 1;
--
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
*/