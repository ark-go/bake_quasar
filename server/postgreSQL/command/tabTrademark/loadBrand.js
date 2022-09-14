import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadBrand(req, res, tabname, timezone, idOne) {
  let sqlP = {
    text: /*sql*/ `
      SELECT
      id,
      name
      from brand
      ORDER BY name
`,
    values: [],
  };
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения бренды", err.toString());
    return {
      error: err.toString(),
    };
  }
}
