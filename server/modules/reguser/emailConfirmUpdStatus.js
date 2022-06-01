import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
async function emailConfirmUpdStatus(id) {
  let tabname = "users_login";
  let sqlP = {
    text: /*sql*/ `
            update ${tabname} set 
            status = $2
            where ${tabname}.id = $1
      `,
    values: [id, "Registered"],
  };
  try {
    let result = await pool.query(sqlP);
    result = result?.rowCount > 0 ? result.rows : null;
    let mess = `Status Registered  ${tabname}`;
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

export { emailConfirmUpdStatus };
