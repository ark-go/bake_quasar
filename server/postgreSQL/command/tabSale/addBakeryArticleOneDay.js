import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function addBakeryArticleOneDay(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  console.log("ВАХ", req.body);
  return {
    result: 1,
  };
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
    price.docnum as price_docnum,
    to_char(price.datestart at time zone $1,  'DD.MM.YYYY') as date_start
--	price.id as price_id
	
from bakery
RIGHT JOIN price_bakery prb ON prb.bakery_id = bakery.id  -- все номера прайсов у печки
RIGHT JOIN price ON price.id = prb.price_id AND price.trademark_id = $3  -- все прайсы у печки, по торговой сети
RIGHT JOIN price_value prv ON prv.price_id = price.id -- все артикулы всех прайсов
    -- теперь получим признак актуальности артикула в конкретной печке, чужих сетей не должно быть
    LEFT JOIN price_value_hidden prvh ON prvh.price_value_id = prv.id AND prvh.bakery_id = prb.bakery_id
  	-- название продукта
    LEFT JOIN productvid as pvid on pvid.id =  prv.productvid_id
    LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
    LEFT JOIN unit on unit.id = pvid.unit_id
    LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id
	--

  where bakery.id = $2 AND price.datestart <= $4 at time zone $1
  ${req.body.showHiddenArticle ? "" : "AND NOT hidden IS TRUE"}
  order by article, price.datestart DESC
`,
    values: [
      timezone,
      req.body.bakery_id,
      req.body.trademark_id,
      // req.body.dateBetween.from,
      req.body.dateBetween?.to ||
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
    // console.log("region", result);
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
