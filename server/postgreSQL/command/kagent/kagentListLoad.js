import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function kagentListLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  if (!["kagentvids", "kagentgroups"].includes(req.body?.tableName)) {
    return {
      error: "kagentListLoad, Не правильный формат данных!",
    };
  }

  let tabname = escape(req.body.tableName); // без "s"
  let id = req.body?.id;
  var tabnameSprav = tabname.replace(/^\|+|s+$/g, ""); // обрезает конец "s"
  console.log(">>>", tabnameSprav, id);
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id AS id,  -- id списка 
      ${tabnameSprav}.name AS name,  -- наименование из справочника
    
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN ${tabnameSprav} ON ${tabnameSprav}.id = ${tabname}.${tabnameSprav}_id
      WHERE ${tabname}.kagent_id = $2
      ORDER BY ${tabnameSprav}.name
`,
    values: [timezone, id],
  };
  //console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //    console.log(result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения списков !", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
