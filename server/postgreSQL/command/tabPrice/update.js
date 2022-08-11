import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function update(req, res, tabname, timezone, idOne) {
  //! table - territory
  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      name = $2
      where ${tabname}.id = $1
      
`,
    values: [req.body.row.id, req.body.row.name],
  };
  try {
    console.log("xxxxxxx", sqlP);
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //   console.log("territory", result);
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
