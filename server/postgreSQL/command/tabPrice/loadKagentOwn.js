import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadKagentOwn(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - Trademark
  let sqlP = {
    text: /*sql*/ `
    select 
      kg.id,
      kg.name as name,
      kbk.count as count_bakery
      
      from (
        select parent_id,count(child_id) as count from kagent_x_bakery_own_get_kagentown_ondate($1 AT TIME ZONE $2)
        where child_id = ANY(select child_id from trademark_x_bakery_get_trademark_ondate($1 AT TIME ZONE $2)
                              where parent_id = $3)
        group by parent_id
        ) as kbk
      LEFT JOIN kagent as kg on kg.id = kbk.parent_id
      
      ORDER BY kg.name
`,
    values: [req.body.datestart, timezone, req.body.trademark_id],
  };
  if (idOne) sqlP.values = [timezone, idOne];
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
