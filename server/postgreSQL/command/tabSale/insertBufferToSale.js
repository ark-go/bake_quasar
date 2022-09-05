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

  console.log(timezone);
  // console.log(req.body.rows);
  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `

    WITH saleBuffers AS
    (
    select  * from json_populate_recordset(null::record, $3::json) AS (
      datesale timestamptz,
      bakery_id bigint,
      price_value_id bigint,
      trademark_id bigint,
      kagent_id bigint,
      kagent_own_id bigint,
      filename citext,
      countsale numeric,
      price_id bigint
       )
    ),
    
    forsaletable as (
    select 
    saleBuffers.datesale as datesale,
    saleBuffers.bakery_id as bakery_id,
    saleBuffers.price_value_id as price_value_id,
 --   saleBuffers.datesale as datesale, -- at time zone $1 as datesale,
    saleBuffers.trademark_id as trademark_id,
    saleBuffers.kagent_id as kagent_id,
    saleBuffers.kagent_own_id as kagent_own_id,

     kagfr.parent_id as kagent_franch_id,

    'буфер' as filename,
    saleBuffers.countsale as countsale,
    saleBuffers.price_id as price_id,
    
   '' as description, 
    $2::bigint as user_id,
    CURRENT_TIMESTAMP as user_date
    --as description
    -- ,*
   
     from saleBuffers

     LEFT JOIN LATERAL (select * from kagent_x_bakery_franch_get_last(saleBuffers.bakery_id, saleBuffers.datesale at time zone $1,false)) kagfr
       ON kagfr.child_id = saleBuffers.bakery_id

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
      //  req.body.bakery_id, //1
      //  req.body.trademark_id, //2
      timezone, // 1
      req.session.user.id, // 2
      JSON.stringify(req.body.rows), // 3
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //console.log("wher", sqlP);
  try {
    let result = await pool.query(sqlP);

    //console.log("addBakeryArticleOneDay res", result);
    // console.log("Вставка insertBufferToSale", result);
    // result = result.rowCount > 0 ? result.rows : null;
    //console.log("rows insertBufferToSale", result.rows);
    // если добавили чтото - то вернем массив со строкой с одним полем countsale
    // если не добавили то null
    return {
      result: result.rowCount, // сколько вставлено
    };
  } catch (err) {
    console.log("Ошибка insertBufferToSale 1", err.toString());
    return {
      error:
        "<br>Возможно не найдены данные в базе, артикул<br><br>" +
        err.toString(),
    };
  }
}
