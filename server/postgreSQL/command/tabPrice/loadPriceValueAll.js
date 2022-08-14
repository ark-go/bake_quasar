import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValueAll(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // читаем список цен
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "price_value";
  let sqlP = {
    text: /*sql*/ `
    select pr.id, pr.datestart, 
    to_char(pr.datestart at time zone $1,  'DD.MM.YYYY') as datestart_str,
    pr.docnum as docnum,
    prb.bakery_id,
    trd.name as trademark_name,
    prkg.name as kagent_price_name,
    bak.name as bakery_name,
    prbf.kagent_id,
    kg.name as kagent_franch_name,
    prv.article as article,
    prv.price_name as tovar_name,
    concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
    prv.cena as cena_tovar,
    prbf.cena as cena_franch   -- franch
    from price pr
    LEFT JOIN kagent prkg ON prkg.id = pr.kagent_id
    LEFT JOIN trademark trd ON trd.id = pr.trademark_id
    LEFT JOIN price_bakery prb ON prb.price_id = pr.id -- AND prb.bakery_id = 36 -- (только по этой 36 печке) -- берем bakery_id  4  пекарни
    LEFT JOIN bakery bak ON bak.id = prb.bakery_id  -- достаем имена печек для прайса
    LEFT JOIN price_value prv ON prv.price_id = pr.id -- AND prv.article = '030303' -- только этот артикул -- article, price_name товар,  4*3  = 12 записей морковки
    LEFT JOIN price_bakery_franch prbf ON prbf.price_bakery_id = prb.id AND prbf.price_value_id = prv.id -- получаем контрагентов и их цены к прайсам
    LEFT JOIN kagent kg ON kg.id = prbf.kagent_id
    --
          LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
          LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
          LEFT JOIN unit on unit.id = pvid.unit_id
          LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
        
    -- where 
    --  pr.datestart = '2022-02-10'
    -- AND pr.trademark_id = 6
    --kagent_id
    --kagenr_own_id
    ORDER BY pr.datestart DESC, docnum, trademark_name, kagent_price_name, bakery_name 
`,
    values: [
      timezone,
      //   req.body.price_id, // 1
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
    console.log("Ошибка чтения loadPriceValueAll", err.toString());
    return {
      error: err.toString(),
    };
  }
}
