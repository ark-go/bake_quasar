import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function addBakeryToPrice(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "price_bakery";
  let sqlP = {
    text: /*sql*/ `
      
      INSERT INTO price_bakery (price_id, bakery_id, user_id)
      values($1,unnest($2::bigint[]),$3)

`,
    values: [
      req.body.price_id, // 1
      req.body.bakeryArray, // 2
      req?.session?.user?.id || null, //3
    ],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result.rowCount,
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
