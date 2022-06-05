import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
//import { update } from "./update.js";
import { load } from "./load.js";
import escape from "pg-escape";

export async function add(req, res, tabname, timezone) {
  if (!req.body?.name || !req.body?.name.trim()) {
    return {
      error: "Не хватает данных. add",
    };
  }
  req.body.name = req.body.name.trim();

  if (req.body?.id) {
    //   return await update(req, res, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (
        parent_id,name,description,sorted
      )
      VALUES (
        $1,$2,$3,$4)
      RETURNING id, name;

      `,
    values: [
      req.body?.parent_id,
      req.body?.name,
      req.body?.description,
      req.body?.sorted || 0,
    ],
  };

  try {
    // console.log("add department", sqlP);
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    //console.log(mess, result);
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
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
