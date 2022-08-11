import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function deleteBakeryFromPrice(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  tabname = "price_bakery";
  let sqlP = {
    text: /*sql*/ `
      
      delete from price_bakery
      where price_id = $1 AND bakery_id = ANY($2::bigint[])
`,
    values: [
      req.body.price_id, // 1
      req.body.bakeryArray, // 2
    ],
  };
  try {
    let result = await pool.query(sqlP);
    //console.log("deleteee", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result.rowCount,
    };
  } catch (err) {
    console.log("Ошибка удаления ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
