import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function removeBakeryArticleOneDay(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  console.log("ВАХ", req.body);

  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
    DELETE FROM sale
    WHERE 
      datesale = $1 at time zone $4
      AND bakery_id = $2 
      AND price_value_id = $3
    
`,
    values: [
      req.body.datesale, //1
      req.body.bakery_id, //2
      req.body.price_value_id, //3
      timezone, // 14
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount;
    console.log("removeBakeryArticleOneDay", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка removeBakeryArticleOneDay", err.toString());
    return {
      error: err.toString(),
    };
  }
}
