import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakeryDocument(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "price_bakery";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      price_bakery.id as "id",
      price_bakery.id as "price_bakery_id",
      price_bakery.price_id as "price_id",
      price_bakery.bakery_id as "bakery_id",
      kgfranch.name as "kagent_franch_name",
      kgfranch.id as "kagent_franch_id",
      bakery.name as "bakery_name",
     -- COUNT (kgfranch.id) OVER (
     --   PARTITION BY kgfranch.id
     -- ) as kagent_franch_count,
      
      --
      price_bakery.user_id as "user_id",
      price_bakery.user_date as "user_date",
      price_bakery.meta as "meta"
      from price_bakery
         LEFT JOIN LATERAL(select * from kagent_x_bakery_franch_get_last(price_bakery.bakery_id,$1 AT TIME ZONE $2) ) 
         as kbfr  ON kbfr.child_id = price_bakery.bakery_id
         LEFT JOIN kagent kgfranch ON kgfranch.id = kbfr.parent_id
         --
         LEFT JOIN bakery on bakery.id = price_bakery.bakery_id
      where price_bakery.price_id = $3
      ${wher}
      ORDER BY bakery.name DESC
`,
    values: [
      req.body.datestart, // 1
      timezone, // 2
      req.body.price_id, // 3
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
    console.log("Ошибка чтения loadBakeryDocument", err.toString());
    return {
      error: err.toString(),
    };
  }
}
