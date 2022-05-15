import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function addTrademark(req, res, tabname, timezone) {
  let idTrademark = req.body?.idTrademark;
  let idKagent = req.body?.idKagent;
  if (!idTrademark || !idKagent) {
    return {
      error: "Не хватает данных. add",
    };
  }
  //let tabname = "trademark"; //escape(req.body?.tableName);
  let sqlP = {
    text: /*sql*/ `
      INSERT INTO kagent_tm (trademark_id,kagent_id, user_id, user_date)
      VALUES ($1,$2,$3,CURRENT_TIMESTAMP)
      RETURNING id, trademark_id, kagent_id;

      `,
    values: [idTrademark, idKagent, req?.session?.user?.id],
  };

  //console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Добавлено ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess,req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения ", addTrademark, err.toString());
    return {
      error: err.toString(),
    };
  }
}
