import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadTrademark(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - Trademark
  let sqlP = {
    text: /*sql*/ `
      select 
      td.count as count_bakery, 
      trd.id,
      trd.name as name,
      br.name as brand_name
      
      from(
        select parent_id,count(child_id) as count from trademark_x_bakery_get_trademark_ondate($1 AT TIME ZONE $2)
        group by parent_id
        ) as td
      LEFT JOIN trademark as trd on trd.id = td.parent_id
      LEFT JOIN brand as br on br.id = trd.brand_id
      
      ORDER BY trd.name
`,
    values: [req.body.datestart, timezone],
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
