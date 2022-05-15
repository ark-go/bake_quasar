import { pool } from "../initPostgreSQL.js";

export async function specdocvalueLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let specdoc_id = null;
  if (req.body?.specdoc_id) specdoc_id = req.body?.specdoc_id;
  else {
    return {
      error: "Не хватает данных.",
    };
  }

  let sqlP = {
    text: /*sql*/ `
    SELECT 
        specdocvalue.id AS id,  -- счетчик id
        specdocvalue.article_store AS article_store,
        specdocvalue.recept_id AS recept_id,
        recept.nomencl_name || '/' || recept.name AS product,
        specdocvalue.cena,
        specdocvalue.prim,
        users.email AS user,
        specdocvalue.user_date AS user_date,     /* дата занесения - изменения*/
        to_char(specdocvalue.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
        specdocvalue.meta AS meta
      FROM specdocvalue
      LEFT JOIN  users ON users.id = specdocvalue.user_id
      LEFT JOIN  (
        SELECT recept.id,recept.article,nomencl_id,nomencl."name" as nomencl_name,recept.article as article_recept,recept."name" from recept,nomencl
        WHERE recept.nomencl_id = nomencl.id
          
      ) AS recept ON recept.id = specdocvalue.recept_id
      WHERE specdocvalue.specdoc_id = $2
`,
    values: [timezone, specdoc_id],
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log(result, specdoc_id);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения specdocvalueLoad", err.toString());
    return {
      error: err.toString(),
    };
  }
}
