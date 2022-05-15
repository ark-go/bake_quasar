import { pool } from "../initPostgreSQL.js";
// формат дат
// https://www.postgresql.org/docs/9.6/functions-formatting.html
export async function nomenclLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let vidNomencl = "";
  if (req.body?.vidNomencl) vidNomencl = req.body?.vidNomencl;
  let sqlP = {
    text: /*sql*/ `
    select 
    nomencl.id as "nomencl_id",
    nomencl.name as "nomencl_name",
    nomencl.meta as "nomencl_meta",
    vidnomencl.id as "vidnomencl_id",
    vidnomencl.name as "vidnomencl_name",
    vidnomencl.meta as "vidnomencl_meta",
    unit.id as "unit_id",
    unit.name as "unit_name",
    groupraw.id as "groupraw_id",
    groupraw.name as "groupraw_name",
    vidraw.id as "vidraw_id",
    vidraw.name as "vidraw_name",
  --  recept.nomencl_id as "recept_id",
    to_char(nomencl.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date", --(nomencl.user_date at time zone $1) as "user_date",
  -- nomencl.user_date as "user_date",
    users.email as "user_email",
    CASE WHEN recept.nomencl_id IS NULL THEN 'нет' ELSE 'есть' END  AS "recept_check"
    -- NULLIF(recept.id, 'нет') as "re  cept_name"
    FROM  nomencl --nomenclature

    LEFT JOIN  unit ON unit.id = nomencl.unit_id
    LEFT JOIN  vidnomencl ON vidnomencl.id = nomencl.vidnomencl_id
    LEFT JOIN  groupraw ON groupraw.id = nomencl.groupraw_id
    LEFT JOIN  vidraw ON vidraw.id = nomencl.vidraw_id
    LEFT JOIN  (select distinct nomencl_id from recept) as recept ON recept.nomencl_id = nomencl.id --только чтоб получить Да / НЕТ
   -- LEFT JOIN  recept ON recept.nomencl_id = nomencl.id
    LEFT JOIN  users ON users.id = nomencl.user_id
    WHERE vidnomencl_id = $2 AND nomencl.deleted = FALSE ;
`,
    values: [timezone, vidNomencl],
  };

  try {
    let result = await pool.query(sqlP);
    //console.log(result);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log(timezone, result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения nomenclature", err.toString());
    return {
      error: err.toString(),
    };
  }
}
