import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function kagentLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let tabname = escape("kagent");
  let where = "";
  if (req.body?.id) {
    where = `WHERE ${tabname}.id = ` + escape(req.body.id);
  }

  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      ${tabname}.vidreg_id,
      kagentvidreg.name AS "vidreg_name",
      -- получим строковый вид таблицы торговых сетей привязанных у кагенту ----
      (select cast(array_to_string(ARRAY(
        SELECT trademark.name AS name FROM kagent_tm
        LEFT JOIN  trademark ON trademark.id = kagent_tm.trademark_id
        WHERE kagent_tm.kagent_id = ${tabname}.id
        ORDER BY trademark.name
        )
        ,', ') as TEXT ) ) AS trademark_name,
      -- ----

      -- ----
      ${tabname}.inn,
      ${tabname}.franchising,
      ${tabname}.owncompany,
      --  По умолчанию
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta,
      (SELECT '${tabname}' AS tab)
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN kagentvidreg ON kagentvidreg.id = ${tabname}.vidreg_id
      ${where}
      ORDER BY ${tabname}.name
`,
    values: [timezone],
  };
  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //  console.log(result);
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
