import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
// Temporary временный не подтвержден емайл
async function saveUserRegister(userTmp, fa2code, reregister) {
  let tabname1 = "users";
  let tabname2 = "users_login";
  // -------------- добавление в user
  let sqlP1 = /*sql*/ `
      INSERT INTO ${tabname1} (email, u_fam, u_name, u_otch, description,tree_id, "createAt")
      VALUES ($1,$2,$3,$4,$5,
         (select id from tree where meta -> 'forNewUser' = 'true' LIMIT 1 ),
          CURRENT_TIMESTAMP)
      RETURNING id;
      `;
  let sqlV1 = [
    userTmp.email,
    userTmp.fam || "Не указана",
    userTmp.name,
    userTmp.otch,
    userTmp.prim,
  ]; //

  // ----------------- добавление в users_login
  let sqlP2 = /*sql*/ `
      INSERT INTO ${tabname2} (email, username, fa2code,status,createdat,status_date, tmp_user)
      VALUES ($1,
      --  (select id from tree where meta -> 'forNewUser' = 'true' LIMIT 1 ),
              $2,$3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$5)
      RETURNING id;
      `;
  let sqlV2 = [
    userTmp.email,
    userTmp.email,
    fa2code,
    "Temporary",
    {
      email: userTmp.email,
      u_fam: userTmp.fam || "Не указана",
      u_name: userTmp.name,
      u_otch: userTmp.otch,
      description: userTmp.prim,
    },
  ]; // удалил username (.split("@")[0]) пока дублируем емайл
  // --------------- изменение данных в users
  let sqlP3 = /*sql*/ `
      UPDATE users SET 
        rereg = false;
      WHERE email = $1
      RETURNING id;
 `;
  let sqlV3 = [userTmp.email]; // удалил username (.split("@")[0]) пока дублируем емайл

  // -----------------------------------
  try {
    const client = await pool.connect();
    let result = null;
    try {
      console.log("Старт транзакции saveUserRegister.js");
      await client.query("BEGIN");
      if (!reregister) {
        await client.query(sqlP1, sqlV1); // добавляем нового пользователя, нет флага rereg, будет ошибка если там есть юзер
      }
      //  await client.query(sqlP3, sqlV3); // сбрасывем флаг rereg
      result = await client.query(sqlP2, sqlV2); // добавляем нового, в users_login
      await client.query("COMMIT");
      console.log("Commit транзакции saveUserRegister.js");
    } catch (e) {
      console.log("Откат транзакции saveUserRegister.js");
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
    //-----------------------------------
    //   console.log("Старт транзакции saveUserRegister.js");
    //   await client.query("BEGIN");
    //  // let result = null;
    //   if (!reregister) {
    //     result = await client.query(sqlP1, sqlV1);
    //   }
    //   result = await client.query(sqlP2, sqlV2);
    //   await client.query("COMMIT");
    //   console.log("Commit транзакции saveUserRegister.js");

    // ----------------
    // let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Регистрируется кто-то ${tabname2}: ` + userTmp?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, userTmp);
    return {
      result: result[0], // одна строка, ее и заберем
    };
  } catch (err) {
    console.log("Ошибка записи ", tabname2, err.toString());
    return {
      error: err.toString(),
    };
  }
}

export { saveUserRegister };
