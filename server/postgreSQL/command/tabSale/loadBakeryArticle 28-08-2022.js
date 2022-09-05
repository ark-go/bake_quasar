import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakeryArticle(req, res, tabname, timezone, idOne) {
  let wher = "";
  //!
  // req.body.showDoobleArticle = true; // скрыть повторы артикулов
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
with resarticle as (
    select -- distinct on (article)
    prv.id as id, -- id price_value
    prv.article as article_original, -- будем использовать для фильтра, чтобы откидывать с повторным номером сравнивая

    CASE WHEN row_number() OVER (PARTITION BY article ORDER BY price.datestart ASC) = 
               count(*) OVER (PARTITION BY article) 
         THEN
            prv.article
        ELSE 
                concat(prv.article,' [',row_number() OVER (PARTITION BY article ORDER BY price.datestart DESC),']')
    END as article,
    -- concat(prv.article,' [',row_number() OVER (PARTITION BY article ORDER BY price.datestart DESC),']') as article,
    
--      as dooble_article,
    prv.price_name as tovar_name,
	prvh.hidden as hidden,
	---prv.id as price_id,
	concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
	pvid.id as productvid_id,
	bakery.name as bakery_name,
	bakery.id as bakery_id,
    price.docnum as price_docnum,

    CASE WHEN  $6 IS TRUE THEN
      sal.countsale
    ELSE
      sum(sal.countsale) OVER (PARTITION BY article) 
    END as count_sale11,
    -- sum(sal.countsale) OVER (PARTITION BY article) as count_sale,
    sal.countsale as count_sale,
    to_char(price.datestart at time zone $1,  'DD.MM.YYYY') as date_start,
--	price.id as price_id
    prv.cena as cena,
    trademark.name as trademark_name

from bakery
RIGHT JOIN price_bakery prb ON prb.bakery_id = bakery.id  -- все номера прайсов у печки
RIGHT JOIN price ON price.id = prb.price_id AND price.trademark_id = $3  -- все прайсы у печки, по торговой сети
RIGHT JOIN price_value prv ON prv.price_id = price.id -- все артикулы всех прайсов
     
   LEFT JOIN  LATERAL (SELECT sale.price_value_id as price_value_id, SUM(sale.countsale) as countsale from sale
          -- LEFT JOIN price_value_hidden prvh1 ON prvh1.price_value_id = sale.price AND prvh.bakery_id = prb.bakery_id
          --  LEFT JOIN price_value prval ON prval.price_id = sale.price_id
            where (sale.datesale >= $5 at time zone $1  AND sale.datesale <= $4 at time zone $1)
            AND sale.bakery_id = prb.bakery_id 
        --    AND sale.price_id = prb.id
        -- AND sale.price_value_id = prv.id
        GROUP BY price_value_id 
        ) as sal ON sal.price_value_id = prv.id

    -- теперь получим признак актуальности артикула в конкретной печке, чужих сетей не должно быть
    LEFT JOIN price_value_hidden prvh ON prvh.price_value_id = prv.id AND prvh.bakery_id = prb.bakery_id
  	-- название продукта
    LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
    LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    LEFT JOIN unit on unit.id = pvid.unit_id
    LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
	--
  LEFT JOIN trademark  ON trademark.id = price.trademark_id -- trdm.parent_id

  where bakery.id = $2 AND price.datestart <= $4 at time zone $1
  ${req.body.showHiddenArticle ? "" : "AND NOT hidden IS TRUE"}
  
  order by article, price.datestart DESC
)
 select * from resarticle
 ${req.body.showDoobleArticle ? "" : "WHERE article_original = article"}


`,
    values: [
      timezone, //1
      req.body.bakery_id, //2
      req.body.trademark_id, //3
      req.body.dateBetween?.to || //4
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        ).toISOString(),
      req.body.dateBetween.from, // 5
      req.body.showDoobleArticle, // 6
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("loadBakeryArticle", result);
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
