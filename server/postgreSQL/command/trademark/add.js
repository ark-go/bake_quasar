import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function add(req, res, tabname, timezone) {
  let name = req.body?.name ? req.body?.name.trim() : null;
  let brand_id = req.body?.brand_id;
  if (!name || !req.body?.brand_id) {
    return {
      error: "Не хватает данных. add",
    };
  }
  //let tabname = "trademark"; //escape(req.body?.tableName);
  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (name,brand_id, user_id, user_date)
      VALUES ($1,$2,$3,CURRENT_TIMESTAMP)
      RETURNING id, brand_id, name;

      `,
    values: [name, brand_id, req?.session?.user?.id],
  };

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);

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
