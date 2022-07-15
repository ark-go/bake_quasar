import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
// Temporary временный не подтвержден емайл
async function saveUserRegister(userTmp, fa2code) {
  let tabname = "users_login";
  let tabname2 = "";
  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (email,part_id, username, fa2code,status,createdat,status_date)
      VALUES ($1,
        (select id from users_part where meta -> 'freeUser' = 'true' LIMIT 1 ),
        $2,$3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING id;
      `,
    values: [userTmp.email, userTmp.email, fa2code, "Temporary"], // удалил username (.split("@")[0]) пока дублируем емайл
  };
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add user ${tabname}:` + "\n" + userTmp?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, userTmp);
    return {
      result: result[0], // одна строка, ее и заберем
    };
  } catch (err) {
    console.log("Ошибка записи ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}

export { saveUserRegister };
