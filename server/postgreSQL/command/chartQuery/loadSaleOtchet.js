import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadSaleOtchet(req, res, tabname, timezone, idOne) {
  let wher = "";
  //!
  // req.body.showDoobleArticle = true; // скрыть повторы артикулов
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    select 
    bakery.name as bakery_name, 
    sum(sale.countsale) as sum_countsale,
    sum(prv.cena) as sum_cena,
    sum(countsale * prv.cena) as sum_itogocena,
    sum( COALESCE(prbf.cena, prv.cena) ) as sum_cena_franch,
    sum(
    CASE WHEN NOT sale.kagent_franch_id IS NULL THEN
      countsale * COALESCE(prbf.cena, prv.cena)
    END ) as sum_itogocena_franch

  --  price.docnum as docnum,
  --  prv.price_name as tovar_name,
 ---   concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
  --  concat(users.u_fam,' ',users.u_name,' ',users.u_otch) as user_name,
  --  territory.name as territory_name,
  --  concat(userter.u_fam,' ',userter.u_name,' ',userter.u_otch) as manager_territory
    
     from sale
  --  RIGHT JOIN trademark ON trademark.id = sale.trademark_id
    RIGHT JOIN bakery ON bakery.id = sale.bakery_id
    LEFT JOIN price ON price.id = sale.price_id
    --
  --  LEFT JOIN kagent kag ON kag.id = sale.kagent_id
  --  LEFT JOIN kagent kag_own ON kag_own.id = sale.kagent_own_id
  --  LEFT JOIN kagent kag_franch ON kag_franch.id = sale.kagent_franch_id
    --
    LEFT JOIN price_value prv ON prv.id = sale.price_value_id
    LEFT JOIN price_bakery prb ON prb.price_id = price.id AND prb.bakery_id = bakery.id
    LEFT JOIN price_bakery_franch prbf ON prbf.price_value_id = prv.id AND prbf.price_bakery_id = prb.id 
  --    LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(prb.bakery_id,sale.datesale at time zone $1,false)) kagfr
  --    ON kagfr.child_id = prb.bakery_id
  --    LEFT JOIN kagent as kagentfranch ON kagentfranch.id = kagfr.parent_id
  	-- название продукта
  --  LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
  --  LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
  --  LEFT JOIN unit on unit.id = pvid.unit_id
  --  LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id                                                  
    --
  --  LEFT JOIN users ON users.id = sale.user_id
    where sale.datesale >= $2 at time zone $1 AND sale.datesale <= $3 at time zone $1
  GROUP BY bakery.name
  --  LIMIT 1
`,
    values: [
      timezone, //1
      req.body.dateBetween.from, // 2
      req.body.dateBetween.to, // 3
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("loadSaleOtchet", result, req.body);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadSaleOtchet", err.toString());
    return {
      error: err.toString(),
    };
  }
}
