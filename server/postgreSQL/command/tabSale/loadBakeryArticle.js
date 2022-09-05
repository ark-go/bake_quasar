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
    select 
    *,
    to_char(datestart at time zone $1,  'DD.MM.YYYY') as date_start
    from get_from_bakery_article_between($2,$3,$5 at time zone $1,$4 at time zone $1,$6,$7)

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
      req.body.showHiddenArticle || false, // 6
      req.body.showDoobleArticle || false, // 7
    ], // timezone
  };
  //if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //  console.log("loadBakeryArticle", result, req.body);
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
