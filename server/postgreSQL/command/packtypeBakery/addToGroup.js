import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
export async function addToGroup(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
 
    SELECT * from packtype_x_bakery_add($1,$2,$3 at time zone $4,$5,$6); -- перенесли
    
          `,
    values: [
      req.body?.bakeryRow,
      req.body?.territoryRow,
      req.body?.dateStart,
      timezone,
      req.body?.transfer,
      null, //req.session?.user?.id,
    ],
  };
  try {
    console.log("territory_manager_add", sqlP);
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    //console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);
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
