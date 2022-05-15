import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function delTrademark(req, res, tabname, timezone) {
  let idTrademark = req.body?.idTrademark;
  let idKagent = req.body?.idKagent;
  if (!idTrademark || !idKagent) {
    return {
      error: "Не хватает данных. del",
    };
  }
  let sqlP = {
    text: /*sql*/ `
    DELETE FROM kagent_tm
      WHERE trademark_id = $1 AND kagent_id = $2
    RETURNING id, trademark_id, kagent_id;

      `,
    values: [idTrademark, idKagent],
  };

  //console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Удалено delTrademark:` + "\n" + req?.session?.user?.email;
    //    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess,req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения ", delTrademark, err.toString());
    return {
      error: err.toString(),
    };
  }
}
