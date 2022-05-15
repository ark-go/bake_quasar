import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { isCheckTableName } from "./spravConf.js";
import escape from "pg-escape";

export async function spravDelete(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  if (!req.body?.tableName || !req.body?.id) {
    return {
      error: "Не хватает данных.",
    };
  }
  if (!isCheckTableName(req.body?.tableName)) {
    return {
      error: "Запрещено, не правильный запрос.",
    };
  }
  //  console.log(">>>3", req.body?.tableName);
  let id = req.body.id;

  let tabname = escape(req.body?.tableName);

  let sqlP = {
    text: /*sql*/ `
    DELETE FROM ${tabname}
      WHERE "id" = $1
    RETURNING id, name;

      `,
    values: [id],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Delete ${tabname}:` + "\n" + req?.session?.user?.email;
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
