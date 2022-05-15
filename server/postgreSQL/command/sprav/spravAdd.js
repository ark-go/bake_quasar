import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { isCheckTableName } from "./spravConf.js";
import escape from "pg-escape";

export async function spravAdd(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let name = req.body?.name.trim();
  if (!req.body?.tableName || !name) {
    return {
      error: "Не хватает данных.",
    };
  }
  if (!isCheckTableName(req.body?.tableName)) {
    return {
      error: "Запрещено, не правильный запрос.",
    };
  }
  // console.log(">>>3", req.body?.tableName);

  let tabname = escape(req.body?.tableName);

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (name, user_id, user_date)
      VALUES ($1,$2,CURRENT_TIMESTAMP)
      RETURNING id, name;

      `,
    values: [name, req?.session?.user?.id],
  };

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess,req);
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
