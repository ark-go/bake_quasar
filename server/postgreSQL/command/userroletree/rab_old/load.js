import { pool } from "../../initPostgreSQL.js";
// import { botSendMessage } from "../../../tg/startTgBot.js";
// import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT 
      ${tabname}.id,
      ${tabname}.parent_id,
      users_roles.name AS name,
      users_roles.description AS description
      FROM ${tabname}
      JOIN users_roles ON users_roles.id = ${tabname}.role_id
      WHERE NOT ${tabname}.meta @> '{"hidden":true}'  -- содержит ли meta такой ключ с таким значением
      --ORDER BY ${tabname}.name
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
