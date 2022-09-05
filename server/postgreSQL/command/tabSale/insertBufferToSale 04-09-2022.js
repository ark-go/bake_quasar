import { pool } from "../../initPostgreSQL.js";
import moment from "moment-timezone";
//import { removeBakeryArticleOneDay } from "./removeBakeryArticleOneDay.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function insertBufferToSale(req, res, tabname, timezone, idOne) {
  // console.log("ВАХ", req.body);

  if (!req.body.rows || !req.body.bakery_id || !req.body.trademark_id) {
    return {
      error: "Нехватает данных",
    };
  }
  let rowstz = [];
  let errorTime = false;
  // здесь у меня московское время
  req.body.rows.forEach((val) => {
    let checkDate = moment(val.datesale, "DD.MM.YYYY", true);
    if (checkDate.isValid()) {
      // val.datesale = moment.tz(checkDate, "Asia/Yekaterinburg").format(); // / 1000; //.format("DD.MM.YYYY");
      val.datesale = moment(checkDate).format();
    } else {
      errorTime = true;
    }
    rowstz.push(val);
  });
  if (errorTime) {
    return {
      error: "<br>Ошибка в датах",
    };
  }
  console.log(timezone);
  // return {
  //   result: "ok",
  // };
  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `

    WITH saleBuffers AS
    (
    
    select  * from json_populate_recordset(null::record, $5::json) AS (
      bakery_id bigint,     
      trademark_id bigint,  
      datesale timestamptz ,
      article citext,
      count numeric
       )
    ),
    artic as (
     
    select -- distinct on (article)
        prv.article as article,
      price.trademark_id as trademark_id,
      bakery.id as bakery_id,
      prv.id as price_value_id,
        prv.price_name as tovar_name,
      prv.price_id as price_id,
    --	concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
      prv.id as productvid_id,
        price.docnum as price_docnum,
      price.datestart as datestart,
      lag(price.datestart,1) OVER (PARTITION BY prv.article ORDER BY price.datestart DESC) as dateend,
        prv.cena as cena,
      price.kagent_id as kagent_id,
      price.kagent_own_id  as kagent_own_id
     -- 09-10 pbf.kagent_id as kagent_franch_id
    -- kagfr.parent_id as kagent_franch_id
    from bakery
    RIGHT JOIN price_bakery prb ON prb.bakery_id = bakery.id  -- все номера прайсов у печки
    RIGHT JOIN price ON price.id = prb.price_id AND price.trademark_id = $2 -- ! trademark_id  $3  -- все прайсы у печки, по торговой сети
    RIGHT JOIN price_value prv ON prv.price_id = price.id -- все артикулы всех прайсов
--    LEFT JOIN saleBuffers ON datesale >= price.datestart AND ( saleBuffers.datesale < dateend OR dateend IS null )
    -- 01-09 LEFT JOIN price_bakery_franch as pbf on pbf.price_value_id = prv.id AND pbf.price_bakery_id = prb.id  -- price_bakery !!!

--    LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(prb.bakery_id,saleBuffers.datesale at time zone $3,false)) kagfr
--       ON kagfr.child_id = prb.bakery_id
    --LEFT JOIN kagent as kagentfranch ON kagentfranch.id = kagfr.parent_id    

      where bakery.id = $1
      
      order by article, price.datestart DESC
    ),
    forsaletable as (
    select 
    saleBuffers.datesale at time zone $3 as datesale,
    artic.bakery_id as bakery_id,
    artic.price_value_id as price_value_id,
    artic.trademark_id as trademark_id,
    artic.kagent_id as kagent_id,
    artic.kagent_own_id as kagent_own_id,
  --  artic.kagent_franch_id as kagent_franch_id,
    kagfr.parent_id as kagent_franch_id,
  --  pbf.kagent_id as kagent_franch_id,
    'буфер' as filename,
    saleBuffers.count as countsale,
    artic.price_id as price_id,
   '' as description, 
    $4::bigint as user_id,
    CURRENT_TIMESTAMP as user_date
    --as description
    -- ,*
     from saleBuffers
    LEFT JOIN artic ON artic.article = saleBuffers.article AND  saleBuffers.datesale >= artic.datestart 
               -- захватываем оба крайних значения  с 5 января по 7 января = три дня
                     AND ( saleBuffers.datesale <= artic.dateend OR artic.dateend IS null )
--    LEFT JOIN price_bakery_franch as pbf on pbf.price_value_id = artic.price_value_id AND pbf.price_bakery_id = artic.bakery_id  -- price_bakery !!!
    LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(artic.bakery_id, saleBuffers.datesale at time zone $3,false)) kagfr
       ON kagfr.child_id = artic.bakery_id


)
  --  select * from forsaletable
  -- -------------------------------------------------------------------------------------
    INSERT INTO sale ( datesale, bakery_id, price_value_id, trademark_id, 
      kagent_id, kagent_own_id, kagent_franch_id,
      filename, countsale, price_id, description, 
      user_id, user_date)
      SELECT  
      -- время ставим клиентское, почему не понятно до сих пор
      datesale , bakery_id, price_value_id, trademark_id, 
      kagent_id, kagent_own_id, kagent_franch_id,
      filename, countsale, price_id, description, 
      user_id, user_date

      FROM forsaletable
      where COALESCE(countsale, 0) <> 0::Numeric
     ON CONFLICT (datesale, bakery_id, price_value_id) DO 
     UPDATE SET
     countsale = EXCLUDED.countsale,
     user_id = EXCLUDED.user_id,
     kagent_id = EXCLUDED.kagent_id,
     kagent_own_id = EXCLUDED.kagent_own_id,
     kagent_franch_id = EXCLUDED.kagent_franch_id,
     filename = 'буфер-х',
     user_date = CURRENT_TIMESTAMP
     RETURNING *

`,
    values: [
      req.body.bakery_id, //1
      req.body.trademark_id, //2
      //  req.body.dateBetween.from, //4
      //  req.body.dateBetween.to, //5
      timezone, // 3
      req.session.user.id, //4
      // JSON.stringify(req.body.rows), // 5
      JSON.stringify(rowstz),
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  // console.log("wher", sqlP);
  try {
    let result = await pool.query(sqlP);

    //console.log("addBakeryArticleOneDay res", result);
    console.log("Вставка insertBufferToSale", result.rowCount);
    // result = result.rowCount > 0 ? result.rows : null;
    //console.log("rows insertBufferToSale", result.rows);
    // если добавили чтото - то вернем массив со строкой с одним полем countsale
    // если не добавили то null
    return {
      result: result.rowCount, // сколько вставлено
    };
  } catch (err) {
    console.log("Ошибка insertBufferToSale", err.toString());
    return {
      error:
        "<br>Возможно не найдены данные в базе, артикул<br><br>" +
        err.toString(),
    };
  }
}
