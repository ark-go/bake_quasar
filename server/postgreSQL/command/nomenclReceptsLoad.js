import { pool } from "../initPostgreSQL.js";
// формат дат
// https://www.postgresql.org/docs/9.6/functions-formatting.html

// список всего и номенклатуры и рецептов
export async function nomenclReceptsLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let sqlP = {
    text: /*sql*/ `
        select nomencl.article,
        CASE
           WHEN recept.article is null THEN nomencl.article
           ELSE recept.article 
         END 
         AS article, 
         nomencl.id as nomencl_id,nomencl.name,recept.id as recept_id, vidnomencl.name as vidnomencl_name,
        CASE
           WHEN recept.name is null THEN nomencl.name
           ELSE (nomencl.name ||'/'||recept.name) 
         END 
         AS recept_name
       from nomencl
       LEFT JOIN vidnomencl
       ON nomencl.vidnomencl_id = vidnomencl.id
       LEFT JOIN recept
       ON nomencl.id = recept.nomencl_id
       where vidnomencl.meta @> '{"isRecept":true}'
       order by nomencl.name, recept.name
    `,
    values: [],
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
    console.log("Ошибка чтения nomenclReceptsLoad", err.toString());
    return {
      error: err.toString(),
    };
  }
}
