import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { load } from "./load.js";
import escape from "pg-escape";

export async function insert(req, res, tabname, timezone) {
  let id = req.body.id;
  console.log("insert: ", req.body);
  //let tabname = "trademark"; //escape(req.body?.tableName);

  let sqlAfter = {
    text: /*sql*/ `
    select * from tree_insert_after($1,$2,$3)
      `,
    values: [req.body.to, req.body.name || "ку после", req?.session?.user?.id],
  };
  let sqlBefore = {
    text: /*sql*/ `
    select * from tree_insert_before($1,$2,$3)
      `,
    values: [req.body.to, req.body.name || "ку перед", req?.session?.user?.id],
  };
  let sqlOver = {
    text: /*sql*/ `
    select * from tree_insert_in($1,$2,$3)
      `,
    values: [req.body.to, req.body.name || "ку over", req?.session?.user?.id],
  };
  let sqlDelete = {
    text: /*sql*/ `
    select * from tree_delete($1)
      `,
    values: [req.body.to],
  };
  //  console.log(">>>", sqlP);

  try {
    let result = null;
    if (req.body.hitmode == "after") {
      result = await pool.query(sqlAfter);
    }
    if (req.body.hitmode == "before") {
      result = await pool.query(sqlBefore);
    }
    if (req.body.hitmode == "over") {
      result = await pool.query(sqlOver);
    }
    if (req.body.hitmode == "delete") {
      result = await pool.query(sqlDelete);
    }
    //result = result.rowCount > 0 ? result.rows : null;
    console.log("insert", result);
    let mess = `Insert ${req.body.hitmode} ${tabname}`;
    botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка Вставки ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
