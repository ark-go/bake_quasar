import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

/**  по ID контрагента  прочитаем все его торговые сети  
  req.body.kadent_id
*/
export async function loadTrademark(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
      SELECT
     -- kagent_tm.id,
     -- trademark.id AS id,
     trademark_id AS id
     -- trademark.name AS name,
     -- brand.id AS "brand_id",
     -- brand.name AS "brand_name",
     -- users.email AS "user_email",
     -- to_char(kagent_tm.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
     -- kagent_tm.meta
      FROM kagent_tm
     -- LEFT JOIN  users ON users.id = kagent_tm.user_id
     -- LEFT JOIN  trademark ON trademark.id = kagent_tm.trademark_id
     -- LEFT JOIN  brand ON brand.id = trademark.brand_id
     -- WHERE kagent_tm.kagent_id = $2
      WHERE kagent_tm.kagent_id = $1
     -- ORDER BY trademark.name
`,
    // values: [timezone, req.body.kagent_id],
    values: [req.body.kagent_id],
  };
  //console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log(result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
