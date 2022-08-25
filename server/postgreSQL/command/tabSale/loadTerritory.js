import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadTerritory(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  //! table - Trademark
  let sqlP = {
    text: /*sql*/ `
      select 
      id,
      name
      -- concat(trademark.name,' (',brand.name,')') as name
      from territory
      -- LEFT JOIN brand ON brand.id = trademark.brand_id
      ORDER BY name
`,
    values: [], // timezone
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
    console.log("Ошибка loadTerritory ", err.toString());
    return {
      error: err.toString(),
    };
  }
}
