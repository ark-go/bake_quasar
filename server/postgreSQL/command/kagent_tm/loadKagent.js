import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

/**  по ID контрагента  прочитаем все его торговые сети  
  req.body.kadent_id
*/
export async function loadKagent(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.trademark_id,
      trademark.name AS name
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  trademark ON trademark.id = ${tabname}.trademark_id
      ORDER BY ${tabname}.name
`,
    values: [req.body.kagent_id, timezone],
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
