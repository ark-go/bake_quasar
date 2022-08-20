import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function toggleHiddenArticle(req, res, tabname, timezone, idOne) {
  let wher = "";
  //! table - price_value_hidden

  if (!req.body.bakery_id || !req.body.price_value_id)
    return {
      error: "Нет данных. - 787",
    };

  let sqlP = {
    text: /*sql*/ `
      delete from price_value_hidden
      where price_value_id = $1 AND bakery_id = $2
`,
    values: [req.body.price_value_id, req.body.bakery_id], // timezone
  };
  if (req.body.hidden) {
    sqlP = {
      text: /*sql*/ `
        insert into price_value_hidden (price_value_id, bakery_id, hidden)
        values ($1, $2, true)
  `,
      values: [req.body?.price_value_id, req.body.bakery_id], // timezone
    };
  }

  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount;
    // console.log("region", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
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
