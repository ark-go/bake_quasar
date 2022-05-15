import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function kagentListDelete(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;

  if (!["kagentvids", "kagentgroups"].includes(req.body?.tableName)) {
    return {
      error: ".Не правильный формат данных!",
    };
  }

  let tabname = escape(req.body?.tableName);
  let idList = req.body?.idList;
  //let kagentSpravId = req.body?.kagentSpravId;

  var tabnameSprav = tabname.replace(/^\|+|s+$/g, ""); // обрезает конец "s"

  // console.log(">>>", tabnameSprav, idList);
  let sqlP = {
    text: /*sql*/ `
    DELETE FROM ${tabname}
    WHERE "id" = $1
  RETURNING id;
     `,
    values: [idList],
  };
  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log(result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка удаления из списка !", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
