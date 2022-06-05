import { pool } from "../../initPostgreSQL.js";
// import { botSendMessage } from "../../../tg/startTgBot.js";
// import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT 
      id,
      parent_id,
      name,
      description,
      sorted
      FROM ${tabname}
      ORDER BY ${tabname}.name
`,
    values: [],
  };
  // if (idOne) sqlP.values = [timezone, idOne];
  //console.log("wher", sqlP);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log("departments", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: {
        nodes: result,
        currentId: idOne,
      },
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
