import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValueSelectArticle(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // читаем список цен
  let wher = "";
  tabname = "price_value";
  let sqlP = {
    text: /*sql*/ `
      SELECT distinct ON (price_value.price_name)
      price_value.id as "id",
      price_value.price_id as price_id,
      price_value.article as article,
      price_value.price_name as price_name,  -- название товара
      price_value.productvid_id as productvid_id
   --   concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
   --   price_value.cena as cena,
   --   price_value.description as description,
      --
   --   price_value.user_id as "user_id",
   --   price_value.user_date as "user_date",
   --   price_value.meta as "meta"
      from price_value
      LEFT JOIN price on price.id = price_value.price_id AND price.kagent_id = $2
    --  LEFT JOIN productvid as pvid on pvid.id =  price_value.productvid_id
    --  LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    --  LEFT JOIN unit on unit.id = pvid.unit_id
    --  LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
      
      where price_value.article = $1 AND price_value.user_date > (current_timestamp - interval '6 month')
      ${wher}
      ORDER BY price_name
`,
    values: [
      req.body.article && req.body.article.trim(), // 1
      req.body.kagent_id || 0,
      //  timezone // 2
    ],
  };
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : [];
    console.log("loadPriceValueSelectArticle", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadPriceValueSelectArticle", err.toString());
    return {
      error: err.toString(),
    };
  }
}
