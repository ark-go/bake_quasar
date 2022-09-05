import { pool } from "../../initPostgreSQL.js";
import moment from "moment-timezone";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakeryArticleAndBuffer(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  let wher = "";
  //!  row.body.rowsBuffer
  // req.body.showDoobleArticle = true; // скрыть повторы артикулов
  if (!req.body.rowsBuffer || !req.body.bakery_id || !req.body.trademark_id) {
    return {
      error: "Нехватает данных",
    };
  }
  let rowstz = [];
  let errorTime = false;
  // здесь у меня московское время
  req.body.rowsBuffer.forEach((val) => {
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
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    WITH rowsBuffers AS
    (
    
    select  * from json_populate_recordset(null::record, $8::json) AS (
      bakery_id bigint,     
      trademark_id bigint,  
      datesale timestamptz ,
      article citext,
      count numeric
       )
    )
    select 
    rowsBuffers.article as article_buff,
    rowsBuffers.bakery_id as bakery_id_buff,
    rowsBuffers.trademark_id as trademark_id_buff,
    rowsBuffers.datesale as datesale_buff,
    to_char(rowsBuffers.datesale at time zone $1,  'DD.MM.YYYY') as datesale_str_buff,
    rowsBuffers.count as count_buff,
    sale.countsale as count_sale_old,     
    art.*,

    to_char(datestart at time zone $1,  'DD.MM.YYYY') as date_start
   -- from get_from_bakery_article_between($2,$3,$5 at time zone $1,$4 at time zone $1,$6,$7) as art
    from get_from_bakery_article_between($2,$3,$5 at time zone $1,$4 at time zone $1,$6,$7) as art
    FULL JOIN rowsBuffers ON rowsBuffers.article = art.article_original
                     AND rowsBuffers.trademark_id = art.trademark_id 
                     AND rowsBuffers.bakery_id = art.bakery_id

                     AND (
                         -- продажа равна или больше старта прайса но меньше dateend (перекрытие прайса) 
                         -- а у другого прайса точно есть старт, потому что мы видим dataend
                            (rowsBuffers.datesale >= art.datestart AND rowsBuffers.datesale < art.dateend)
                            OR
                            -- если перекрылось прайсом то берем дату старта и null - т.е. прайс не закрылся еще
                            (rowsBuffers.datesale >= art.datestart AND art.dateend IS null )
                         )
    LEFT JOIN sale ON sale.price_value_id = art.id
                            AND sale.datesale = rowsBuffers.datesale
                            AND sale.bakery_id = rowsBuffers.bakery_id  
                     -- попадаем в диапазон потому что он есть
                    -- AND ( NOT art.dateend IS null AND rowsBuffers.datesale >= art.datestart AND  rowsBuffers.datesale <= art.dateend)

                     -- art.dateend IS null AND rowsBuffers.datesale >= art.datestart AND  


     ORDER BY art.article ASC NULLS FIRST 
`,
    values: [
      timezone, //1
      req.body.bakery_id, //2
      req.body.trademark_id, //3
      req.body.dateBetween?.to, //4
      req.body.dateBetween.from, // 5
      req.body.showHiddenArticle || false, // 6
      true, // req.body.showDoobleArticle || false, // 7
      JSON.stringify(rowstz), // 8
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("loadBakeryArticleAndBuffer", result, "body", req.body);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadBakeryArticleAndBuffer", err.toString());
    return {
      error: err.toString(),
    };
  }
}
