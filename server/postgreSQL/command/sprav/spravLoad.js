import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function spravLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  if (!req.body?.tableNameLoad) {
    return {
      error: "Не указан справочник.",
    };
  }
  let tabname = escape(req.body?.tableNameLoad);
  console.log("sprav load ", tabname);
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      ORDER BY ${tabname}.name
`,
    values: [timezone],
  };
  //console.log(">>>", sqlP);
  let regionSQL = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.regnum || ' ' ||  ${tabname}.name AS name,
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      ORDER BY ${tabname}.name
  `,
    values: [timezone],
  };

  if (tabname == "region") {
    sqlP = regionSQL;
  }

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
  //  console.log("sprav load", tabname, result);
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
