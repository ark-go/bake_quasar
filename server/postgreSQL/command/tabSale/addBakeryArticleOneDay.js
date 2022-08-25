import { pool } from "../../initPostgreSQL.js";
import { removeBakeryArticleOneDay } from "./removeBakeryArticleOneDay.js";
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

  if (!req.body.countsale || req.body.countsale == 0) {
    return await removeBakeryArticleOneDay(req, res, tabname, timezone, idOne);
  }

  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO sale ( datesale, bakery_id, price_value_id, trademark_id, 
      kagent_id, kagent_own_id, kagent_franch_id,
      filename, countsale, price_id, description, 
      meta, user_id, user_date)
     VALUES (
     $1 at time zone $14 , $2, $3, $4,
     $5, $6, $7, 
     $8, $9, $10, $11, 
     $12, $13, CURRENT_TIMESTAMP
     ) 
     ON CONFLICT (datesale, bakery_id, price_value_id) DO 
     UPDATE SET
     countsale = EXCLUDED.countsale,
     user_id = EXCLUDED.user_id,
     user_date = CURRENT_TIMESTAMP
     RETURNING countsale

`,
    values: [
      req.body.datesale, //1
      req.body.bakery_id, //2
      req.body.price_value_id, //3
      req.body.trademark_id, //4
      req.body.kagent_id, //5
      req.body.kagent_own_id, //6
      req.body.kagent_franch_id, //7
      req.body.filename, //8
      req.body.countsale, //9
      req.body.price_id, //10
      "", //11
      {}, //12
      req.session.user.id, //13
      timezone, // 14
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);

    //console.log("addBakeryArticleOneDay res", result);
    result = result.rowCount > 0 ? result.rows : null;
    // если добавили чтото - то вернем массив со строкой с одним полем countsale
    // если не добавили то null
    return {
      result: result, // массив с одним объектом
    };
  } catch (err) {
    console.log("Ошибка addBakeryArticleOneDay", err.toString());
    return {
      error: err.toString(),
    };
  }
}
