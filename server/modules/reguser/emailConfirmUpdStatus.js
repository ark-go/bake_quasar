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
    values: [id, "WaitManualConfirm"],
  };
  // --------------- снимаем галку разрешающу. перерегистрацию
  let sqlPUpdate = {
    text: /*sql*/ `
            update users set 
            rereg = false
            where users.email =
            (select email from users_login where users_login.id = $1)

      `,
    values: [id],
  };
  // ---------------

  // Registered
  try {
    let result = await pool.query(sqlP);
    result = result?.rowCount > 0 ? result.rows : null;
    let mess = `Status WaitManualConfirm  ${tabname}`;

    try {
      await pool.query(sqlPUpdate);
      console.log("Вероятно сняли флаг перерегистрации");
    } catch (e) {
      console.log("Ошибка при снятии флага перерегистрации", e);
    }

    console.log(mess, result);
    botSendMessage(mess);
    return {
      result: true, //  ?
    };
  } catch (err) {
    console.log(
      "Ошибка установки статуса на ручное подверждение ",
      tabname,
      err.toString()
    );
    return {
      error: err.toString(),
    };
  }
}

export { emailConfirmUpdStatus };
