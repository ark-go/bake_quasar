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
    WITH salefull AS (
    select 
    bakery.name as bakery_name, 
   -- sale.datesale as datesale,
    to_char(sale.datesale at time zone $1,  'DD.MM.YYYY') as datesale,
    sale.countsale as countsale,
    prv.cena as cena,
    countsale * prv.cena as itogocena,
    COALESCE(prbf.cena, prv.cena) as cena_franch,
    CASE WHEN NOT kag_franch.name IS NULL THEN
      countsale * COALESCE(prbf.cena, prv.cena)
    END as itogocena_franch,
    concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
    assort.name as assortment,
    ptype.name as product_type,
    ptype.prefix as product_prefix,
    city.name as city,
    brand.name as brand, 
    affiliation.name as affiliation_name,
 
    from sale
    RIGHT JOIN trademark ON trademark.id = sale.trademark_id
    RIGHT JOIN bakery ON bakery.id = sale.bakery_id
    LEFT JOIN price ON price.id = sale.price_id
    --
    LEFT JOIN kagent kag_franch ON kag_franch.id = sale.kagent_franch_id
    --
    LEFT JOIN price_value prv ON prv.id = sale.price_value_id
    LEFT JOIN price_bakery prb ON prb.price_id = price.id AND prb.bakery_id = bakery.id
    LEFT JOIN price_bakery_franch prbf ON prbf.price_value_id = prv.id AND prbf.price_bakery_id = prb.id 
 --
  	-- название продукта
    LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
    LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    LEFT JOIN unit on unit.id = pvid.unit_id
    LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id  
    -- бренд
     LEFT JOIN brand on brand.id = trademark.brand_id      
    -- город
    LEFT JOIN city on city.id = bakery.city_id
    -- территория
    LEFT JOIN LATERAL (select * from territory_x_bakery_get_last(bakery.id,sale.datesale at time zone $1,false)) tblast 
              ON tblast.child_id =  bakery.id 
    LEFT JOIN territory ON territory.id = tblast.parent_id      
    -- регион
    LEFT JOIN LATERAL (select * from  region_x_territory_get_last(territory.id,sale.datesale at time zone $1,false)) terrlast 
    ON terrlast.child_id =  territory.id
    LEFT JOIN region ON region.id = terrlast.parent_id
    -- принадлежность
    LEFT JOIN LATERAL (select * from affiliation_x_bakery_get_last(bakery.id,sale.datesale at time zone $1,false)) affil 
              ON affil.child_id =  bakery.id 
    LEFT JOIN affiliation ON affiliation.id = affil.parent_id
    -- 
    where sale.datesale >= $2 at time zone $1 AND sale.datesale <= $3 at time zone $1
  )
    SELECT autoint.date_auto, salefull.* FROM
     GENERATE_SERIES($2 at time zone $1, $3 at time zone $1, '1 day'::INTERVAL) autoday (date_auto)
     LEFT JOIN salefull ON salefull.datesale = autoday.date_auto
    
    group by bakery_name, countsale

    order by dateday.date_auto
  --  LIMIT 1
`,
    values: [
      timezone, //1
      req.body.dateBetween.from, // 2
      req.body.dateBetween.to, // 3
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("loadSaleOtchet", result, req.body);
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
