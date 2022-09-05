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
    trademark.name as trademark_name, 
    bakery.name as bakery_name, 
    prv.article as article, 
    kag.name as kagent_name,
    kag_own.name as kagent_own_name,
    kag_franch.name as kagent_franch_name,
   -- sale.datesale as datesale,
    to_char(sale.datesale at time zone $1,  'DD.MM.YYYY') as datesale,
    sale.countsale as countsale,
    prv.cena as cena,
    countsale * prv.cena as itogocena,
    COALESCE(prbf.cena, prv.cena) as cena_franch,
    CASE WHEN NOT kag_franch.name IS NULL THEN
      countsale * COALESCE(prbf.cena, prv.cena)
    END as itogocena_franch,
    price.docnum as docnum,
    prv.price_name as tovar_name,
    concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,

    assort.name as assortment,
    ptype.name as product_type,
    ptype.prefix as product_prefix,
    city.name as city,
    brand.name as brand,
    concat(userbakery.u_fam,' ',userbakery.u_name,' ',userbakery.u_otch) as manager_bakery,    
    region.name as region,
    concat(userreg.u_fam,' ',userreg.u_name,' ',userreg.u_otch) as manager_region,    
    territory.name as territory_name,
    concat(userterr.u_fam,' ',userterr.u_name,' ',userterr.u_otch) as manager_territory,    
    
    --concat(userter.u_fam,' ',userter.u_name,' ',userter.u_otch) as manager_territory,
    concat(users.u_fam,' ',users.u_name,' ',users.u_otch) as user_name    
    from sale
    RIGHT JOIN trademark ON trademark.id = sale.trademark_id
    RIGHT JOIN bakery ON bakery.id = sale.bakery_id
    LEFT JOIN price ON price.id = sale.price_id
    --
    LEFT JOIN kagent kag ON kag.id = sale.kagent_id
    LEFT JOIN kagent kag_own ON kag_own.id = sale.kagent_own_id
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
    -- кто продал вводил данные
    LEFT JOIN users ON users.id = sale.user_id
    -- бренд
     LEFT JOIN brand on brand.id = trademark.brand_id      
    -- город
    LEFT JOIN city on city.id = bakery.city_id
    -- манагер пекарни
    LEFT JOIN LATERAL (select * from users_x_bakery_manager_get_last(bakery.id,sale.datesale at time zone $1,false)) bakerylast
    ON bakerylast.child_id = bakery.id
    LEFT JOIN users userbakery ON userbakery.id = bakerylast.parent_id 
    -- территория
    LEFT JOIN LATERAL (select * from territory_x_bakery_get_last(bakery.id,sale.datesale at time zone $1,false)) tblast 
              ON tblast.child_id =  bakery.id 
    LEFT JOIN territory ON territory.id = tblast.parent_id
    --  манагер терртория
    LEFT JOIN LATERAL (select * from users_x_territory_manager_get_last(tblast.parent_id,sale.datesale at time zone $1,false)) utmanlast
              ON utmanlast.child_id = tblast.parent_id
    LEFT JOIN users userterr ON userterr.id = utmanlast.parent_id         
    -- регион
    LEFT JOIN LATERAL (select * from  region_x_territory_get_last(territory.id,sale.datesale at time zone $1,false)) terrlast 
    ON terrlast.child_id =  territory.id
    LEFT JOIN region ON region.id = terrlast.parent_id
    -- манагер регион
    LEFT JOIN LATERAL (select * from users_x_region_manager_get_last(region.id,sale.datesale at time zone $1,false)) regionlast
              ON regionlast.child_id = region.id
    LEFT JOIN users userreg ON userreg.id = regionlast.parent_id

    -- 

    where sale.datesale >= $2 at time zone $1 AND sale.datesale <= $3 at time zone $1
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
