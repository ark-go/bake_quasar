import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
import { load } from "./load.js";

export async function update(req, res, tabname, timezone) {
  if (!req.body?.name || !req.body?.name.trim()) {
    return {
      error: "Не хватает данных. update",
    };
  }
  req.body.name = req.body.name.trim();
  let sqlP = "";
  if (!req.body?.parent_id) {
    sqlP = {
      text: /*sql*/ `
      UPDATE ${tabname} SET
      name = $2, 
      description = $3, 
      sorted = $4
      WHERE "id" = $1
      RETURNING id, name;

      `,
      values: [
        req.body?.id,
        req.body?.name,
        req.body?.description,
        req.body?.sorted,
      ],
    };
  } else {
    sqlP = {
      text: /*sql*/ `
      UPDATE ${tabname} SET
      parent_id = $2
      WHERE "id" = $1
      RETURNING id, name;

      `,
      values: [req.body?.id, req.body?.parent_id],
    };
  }

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);
    if (result && result.length > 0) {
      return await load(req, res, tabname, timezone, result[0]?.id);
    }
    //! что делать, если не вставлена строка, и как тут может появиться
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка update ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
