import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakeryArticle(req, res, tabname, timezone, idOne) {
  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    select distinct on (article)
    prv.id as id, -- id price_value
    prv.article as article,
    prv.price_name as tovar_name,
	---prv.id as price_id,
	concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
	pvid.id as productvid_id,
	bakery.name as bakery_name,
	bakery.id as bakery_id,
  price.docnum as price_docnum,
	to_char(price.datestart at time zone $3,  'DD.MM.YYYY') as date_start
	
  from price_bakery
  LEFT JOIN bakery on bakery.id = price_bakery.bakery_id
  LEFT JOIN price on price.id = price_bakery.price_id
  LEFT JOIN price_value prv ON prv.price_id = price.id

    LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
    LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    LEFT JOIN unit on unit.id = pvid.unit_id
    LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
  where price_bakery.bakery_id = $1  AND price.trademark_id = $2
  order by article,price.datestart DESC
`,
    values: [req.body.bakery_id, req.body.trademark_id, timezone], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("region", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadBakeryArticle", err.toString());
    return {
      error: err.toString(),
    };
  }
}
