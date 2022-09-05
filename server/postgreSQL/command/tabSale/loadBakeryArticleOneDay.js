import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakeryArticleOneDay(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    select distinct on (article)
    prv.id as id, -- id price_value
    prv.article as article,
    prv.price_name as tovar_name,
	prvh.hidden as hidden,
	---prv.id as price_id,
	concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
	pvid.id as productvid_id,
  	bakery.name as bakery_name,
  	bakery.id as bakery_id,
  --  prb.bakery_id as xx,
    price.docnum as price_docnum,
  --  prv.price_name as tovar_name,
 --  concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
    to_char(price.datestart at time zone $1,  'DD.MM.YYYY') as date_start,
  --  sale.datesale at time zone $1 as xxx_sale,
    price.id as price_id,
    -- price.trademark_id as trademark_id,
    trademark.id as trademark_id,
    trademark.name as trademark_name,
    price.kagent_id as kagent_id,	
    --kagent.name as kagent_name,	
    --kagent.id as kagent_id,	
    price.kagent_own_id  as kagent_own_id,
    --kagentown.name as kagent_own_name,
    --kagentown.id as kagent_own_id,
    --kagentfranch.name as kagent_franch_name,
    kagfr.parent_id as kagent_franch_id,

    sale.countsale as count_sale,
    prv.cena as cena

from bakery
RIGHT JOIN price_bakery prb ON prb.bakery_id =   bakery.id  -- все номера прайсов у печки
RIGHT JOIN price ON price.id = prb.price_id AND price.trademark_id = $3  -- все прайсы у печки, по торговой сети
RIGHT JOIN price_value prv ON prv.price_id = price.id -- все артикулы всех прайсов
    -- теперь получим признак актуальности артикула в конкретной печке, чужих сетей не должно быть
    LEFT JOIN price_value_hidden prvh ON prvh.price_value_id = prv.id AND prvh.bakery_id = prb.bakery_id
    -- подтащим продажу
    LEFT JOIN sale on sale.datesale = $4 at time zone $1 AND sale.bakery_id = prb.bakery_id AND sale.price_value_id = prv.id
  	-- название продукта
    LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
    LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    LEFT JOIN unit on unit.id = pvid.unit_id
    LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
	--
      --  LEFT JOIN LATERAL (select * from kagent_x_bakery_get_last(prb.bakery_id, $4 at time zone $1,flase )) as kag
      --      ON kag.child_id = prb.bakery_id
        --  LEFT JOIN kagent ON kagent.id = price.kagent_id -- kag.parent_id
--
      --  LEFT JOIN LATERAL (select * from kagent_x_bakery_own_get_last(prb.bakery_id, $4 at time zone $1,flase )) as kagown
      --  ON kagown.child_id = prb.bakery_id
        --LEFT JOIN kagent as kagentown ON kagentown.id = price.kagent_own_id -- kagown.parent_id
--
        --LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(prb.bakery_id, $4 at time zone $1,flase )) as kagfranch
        --ON kagfranch.child_id = prb.bakery_id
       -- LEFT JOIN kagent as kagentfranch ON kagentfranch.id = kagfranch.parent_id
       -- 01-09
         -- LEFT JOIN price_bakery_franch as pbf on pbf.price_value_id = prv.id AND pbf.price_bakery_id = prb.id 
         -- LEFT JOIN kagent as kagentfranch ON kagentfranch.id = pbf.kagent_id
      --  01-09 
       LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(prb.bakery_id, $4 at time zone $1,false)) kagfr
              ON kagfr.child_id = prb.bakery_id
      -- LEFT JOIN kagent as kagentfranch ON kagentfranch.id = kagfr.parent_id
--
       --LEFT JOIN LATERAL (select * from trademark_x_bakery_get_last(prb.bakery_id, $4 at time zone $1,flase )) as trdm
       --ON trdm.child_id = prb.bakery_id
         LEFT JOIN trademark  ON trademark.id = price.trademark_id -- trdm.parent_id


  where bakery.id = $2 AND price.datestart <= $4 at time zone $1   -- ,? AND price.trademark_id = 
  ${req.body.showHiddenArticle ? "" : "AND NOT hidden IS TRUE"}
  order by article, price.datestart DESC
`,
    values: [
      timezone, //1
      req.body.bakery_id, //2
      req.body.trademark_id, // 3
      // req.body.dateBetween.from,
      req.body.dateBetween?.to || // 4
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        ).toISOString(),
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("loadBakeryArticleOneDay", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadBakeryArticleOneDay", err.toString());
    return {
      error: err.toString(),
    };
  }
}
