import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
async function emailConfirmFindUserCheck(userTmp) {
  let tabname = "users";
  let sqlP = {
    text: /*sql*/ `
            select * from ${tabname} 
            where ${tabname}.email = $1
      `,
    values: [userTmp.email],
  };
  try {
    let result = await pool.query(sqlP);
    // result = result?.rowCount > 0 ? result.rows : null;
    if (result?.rowCount > 0) {
      let mess = `Нашли юзера, при проверке пере-регистрации, повторная..: ${userTmp.email}`;
      //  mess += "\n" + JSON.stringify(result.rows[0]);
      botSendMessage(mess);
    }
    return {
      result: result?.rowCount > 0, // true если нашли
    };
  } catch (err) {
    console.log(
      "Ошибка поиска не дозарегистрированного пользователя 2",
      tabname,
      err.toString()
    );
    return {
      error: err.toString(),
    };
  }
}

export { emailConfirmFindUserCheck };
