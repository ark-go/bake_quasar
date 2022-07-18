import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
// Temporary временный не подтвержден емайл
async function saveUserRegister(userTmp, fa2code, reregistr) {
  let tabname1 = "users";
  let tabname2 = "users_login";
  // --------------
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

  // -----------------
  let sqlP2 = /*sql*/ `
      INSERT INTO ${tabname2} (email, username, fa2code,status,createdat,status_date)
      VALUES ($1,
      --  (select id from tree where meta -> 'forNewUser' = 'true' LIMIT 1 ),
              $2,$3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING id;
      `;
  let sqlV2 = [userTmp.email, userTmp.email, fa2code, "Temporary"]; // удалил username (.split("@")[0]) пока дублируем емайл

  try {
    const client = await pool.connect();
    console.log("Старт транзакции saveUserRegister.js");
    await client.query("BEGIN");
    let result = await client.query(sqlP1, sqlV1);
    result = await client.query(sqlP2, sqlV2);
    await client.query("COMMIT");
    console.log("Commit транзакции saveUserRegister.js");

    // ----------------
    // let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Регистрируется кто-то ${tabname2}:` + "\n" + userTmp?.email;
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
