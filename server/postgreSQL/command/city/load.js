import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      region_kl.id AS "region_id",
      region_kl.name AS "region_name",
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  region_kl ON region_kl.id = ${tabname}.region_id
      ORDER BY ${tabname}.name
`,
    values: [timezone],
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
