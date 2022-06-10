import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { load } from "./load.js";
import escape from "pg-escape";

export async function move(req, res, tabname, timezone) {
  let id = req.body.id;
  console.log("move: ", req.body);
  //let tabname = "trademark"; //escape(req.body?.tableName);

  let sqlP = {
    text: /*sql*/ `
    select * from tree_move($1,$2,$3);
      `,
    values: [req.body.from, req.body.to, req.body.hitmode],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess =
      `Move ${req.body.hitmode} ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);
    // if (result && result.length > 0) {
    //   return await load(req, res, tabname, timezone, result[0]?.id);
    // }
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка Удаления ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
