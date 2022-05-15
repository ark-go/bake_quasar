import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";

export async function kagentListAdd(req, res) {
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
  let kagentId = req.body?.kagentId;
  let kagentSpravId = req.body?.kagentSpravId;

  var tabnameSprav = tabname.replace(/^\|+|s+$/g, ""); // обрезает конец "s"

  console.log(">>>", tabnameSprav, kagentId);
  let sqlP = {
    text: /*sql*/ `
     INSERT INTO ${tabname} (kagent_id,${tabnameSprav}_id, user_id)
     VALUES ($1, $2, $3);
     `,
    values: [kagentId, kagentSpravId, userId],
  };
  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log(result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка добавления в список !", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
