import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
//import { update } from "./update.js";
import { load } from "./load.js";
import escape from "pg-escape";

export async function add(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (
        parent_id,role_id,user_id
      )
      VALUES (
        $1,$2,$3)
      RETURNING id;

      `,
    values: [req.body?.parent_id, req.body?.role_id, req.session.user.id],
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
