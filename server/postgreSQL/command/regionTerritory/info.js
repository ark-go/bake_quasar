import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
export async function info(req, res, tabname, timezone) {
  let sqlP = {
    text: /*sql*/ `
 
    SELECT * from region_x_territory_get_last_info($1); 
    
          `,
    values: [req.body?.childId],
  };
  try {
    // console.log("info ", sqlP);
    let result = await pool.query(sqlP);
    // console.log("info ", result);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `info ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, req.body, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);
    return {
      result: result[0],
    };
  } catch (err) {
    console.log("Ошибка чтения info", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
