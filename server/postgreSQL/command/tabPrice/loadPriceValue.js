import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValue(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // читаем список цен
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "price_value";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      price_value.id as "id",
      price_value.price_id as price_id,
      price_value.article as article,
      price_value.price_name as price_name,
      price_value.productvid_id as productvid_id,
      concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
      price_value.cena as cena,
      price_value.description as description,
      --
      price_value.user_id as "user_id",
      price_value.user_date as "user_date",
      price_value.meta as "meta"
      from price_value
      LEFT JOIN productvid as pvid on pvid.id =  price_value.productvid_id
      LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
      LEFT JOIN unit on unit.id = pvid.unit_id
      LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
      
      where price_value.price_id = $1
      ${wher}
      ORDER BY productvid_name
`,
    values: [
      req.body.price_id, // 1
      //  timezone // 2
    ],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : [];
    // console.log("loadBakeryDocument", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadPriceValue", err.toString());
    return {
      error: err.toString(),
    };
  }
}
