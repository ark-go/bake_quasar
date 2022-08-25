import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBakery(req, res, tabname, timezone, idOne) {
  let wher = "";
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
      select 
      bakery.id as id,
      bakery.name as name,
      territory.name as territory_name,
      territory.id as territory_id,
      to_char(trd.date_start at time zone $4,  'DD.MM.YYYY') as datestart_str,
      to_char(trd.date_end at time zone $4,  'DD.MM.YYYY') as date_end
      
      -- concat(trademark.name,' (',brand.name,')') as name
      -- from (select date_start,child_id from trademark_x_bakery_get_bakery_ondate($1::bigint)) as trd
      from (select distinct on (id, date_start) date_start, date_end, child_id 
            from trademark_x_bakery_get_bakery_ondate_between($1::bigint,$2::timestamptz at time zone $4,$3::timestamptz at time zone $4)
             order by date_start desc     
      ) as trd
      LEFT JOIN bakery ON bakery.id = trd.child_id
      -- 24-08
      LEFT JOIN LATERAL (select * from territory_x_bakery_get_last(child_id, trd.date_start,true)) terrbak ON
           terrbak.child_id = trd.child_id
      LEFT JOIN territory ON territory.id = terrbak.parent_id
      --
      where territory.id = $5
      ORDER BY name
`,
    values: [
      req.body?.trademark_id, //1
      req.body.dateBetween.from, //2
      req.body.dateBetween.to, //3
      timezone, //4
      req.body.territoryId, //5
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
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
