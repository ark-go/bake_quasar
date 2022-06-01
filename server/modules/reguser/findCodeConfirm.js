import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
import { deleteConfirmCode } from "./deleteConfirmCode.js";
async function findCodeConfirm(id, code) {
  let tabname = "users_register";
  let sqlP = {
    text: /*sql*/ `
            SELECT 
            ${tabname}.id,
            ${tabname}.check_maildate
            from ${tabname}
            where id = $1 AND check_mailcode = $2
      `,
    values: [id, code],
  };
  try {
    let result = await pool.query(sqlP);
    result = result?.rowCount > 0 ? result.rows : null;
    let mess = `Find code ${tabname}`;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess);
    if (result) {
      await deleteConfirmCode(id, code);
    }
    return {
      result: result && result[0], // одна строка, ее и заберем? а //!может быть null
    };
  } catch (err) {
    console.log("Ошибка поиска кода ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}

export { findCodeConfirm };
