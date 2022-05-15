import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { isCheckTableName } from "./spravConf.js";
import escape from "pg-escape";

export async function spravUpdate(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let name = req.body?.name.trim();
  if (!req.body?.tableName || !req.body?.id || !name) {
    return {
      error: "Не хватает данных.",
    };
  }
  if (!isCheckTableName(req.body?.tableName)) {
    return {
      error: "Запрещено, не правильный запрос.",
    };
  }
  console.log(">>>3", req.body?.tableName);
  let id = req.body.id;

  let tabname = escape(req.body?.tableName);

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
          name = $2,
          user_id = $3,
          user_date = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING id, name;

      `,
    values: [id, name, req?.session?.user?.id],
  };

  //  console.log(">>>", sqlP);

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
