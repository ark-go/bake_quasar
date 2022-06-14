import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
import { emailConfirmUpdStatus } from "./emailConfirmUpdStatus.js";
async function emailConfirmDelete(id) {
  let tabname = "users_login";
  let sqlP = {
    text: /*sql*/ `
            delete from ${tabname} 
            where ${tabname}.id = $1
            returning *;
      `,
    values: [id],
  };
  try {
    let result = await pool.query(sqlP);
    result = result?.rowCount > 0 ? result.rows : null;
    await emailConfirmUpdStatus(id);
    let mess = `Удалили юзера, не смогли отправить письмо  ${tabname}`;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess);
    return {
      result: true, //
    };
  } catch (err) {
    console.log(
      "Ошибка удаления не дозарегистрированного пользователя",
      tabname,
      err.toString()
    );
    return {
      error: err.toString(),
    };
  }
}

export { emailConfirmDelete };
