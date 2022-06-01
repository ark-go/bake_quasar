import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
import { emailConfirmUpdStatus } from "./emailConfirmUpdStatus.js";
async function deleteConfirmCode(id, code) {
  let tabname = "users_register";
  let sqlP = {
    text: /*sql*/ `
            delete from ${tabname} 
            where ${tabname}.id = $1 AND ${tabname}.check_mailcode = $2
      `,
    values: [id, code],
  };
  try {
    let result = await pool.query(sqlP);
    result = result?.rowCount > 0 ? result.rows : null;
    await emailConfirmUpdStatus(id);
    let mess = `Подтерли код  ${tabname}`;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess);
    return {
      result: true, // одна строка, ее и заберем? а //!может быть null
    };
  } catch (err) {
    console.log("Ошибка удаления кода подтверждения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}

export { deleteConfirmCode };
