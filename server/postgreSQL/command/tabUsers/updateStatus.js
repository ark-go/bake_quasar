import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
import { redisSetUserReload } from "../../../utils/redis/redisSetUserReload.js";

export async function updateStatus(req, res, tabname, timezone, idOne) {
  // меняем статус при регистрации или разрегистрации
  // ------------- Статус в users_login
  let sqlPUpdateStatusLogin = {
    text: /*sql*/ `
    UPDATE users_login SET 
    status = $2
    WHERE email = $1
    RETURNING *
    `,
  };
  let sqlPUpdateStatusLoginVal = [req.body.email, req.body.status];
  //----------------------------
  let sqlPReadUser = {
    text: /*sql*/ `
    select * from users
    WHERE email = $1
    LIMIT 1
    `,
  };
  let sqlPReadUserVal = [req.body.email];
  // ---------------------------
  // ------------- Статус в users_login
  let sqlPUpdateStatusUsers = {
    text: /*sql*/ `
    UPDATE users SET 
    status = $2
    WHERE email = $1
    RETURNING *
    `,
  };
  let sqlPUpdateStatusUsersVal = [req.body.email, req.body.status];
  //----------------------------

  try {
    //let result = await pool.query(sqlP);
    //----------------------------------------------------------
    const client = await pool.connect();
    let updLogin = null;
    let updUser = null;
    try {
      console.log("Старт транзакции updateStatus.js");
      await client.query("BEGIN");
      updLogin = await client.query(
        sqlPUpdateStatusLogin,
        sqlPUpdateStatusLoginVal
      ); // update users_login
      updLogin = updLogin.rowCount > 0 ? updLogin.rows[0] : null;
      // а возможно там и нет юзера, его например, удалили из users_login
      // но в любом случае, поищем юзера в users
      let userL = await client.query(sqlPReadUser, sqlPReadUserVal); // load users
      userL = userL.rowCount > 0 ? userL.rows[0] : null;
      // если нашли то обновим статус и там

      if (userL) {
        // нашли и прочитали в users
        updUser = await client.query(
          sqlPUpdateStatusUsers,
          sqlPUpdateStatusUsersVal
        ); // update users
        updUser = updUser.rowCount > 0 ? updUser.rows[0] : null;
      }
      // обновили в users

      await client.query("COMMIT");
      console.log("Commit транзакции updateStatus.js");
    } catch (e) {
      console.log("Откат транзакции updateStatus.js");
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
    if (updUser) {
      req.session.user.isReloadUser = true;
      // await redisSetUserReload(+updUser.id);
    }
    let mess = `Обновление статуса:` + req.body.email;
    botSendMessage(mess);
    return {
      result: updLogin, //
    };
  } catch (err) {
    console.log("Ошибка записи ", "updateStatus.js", err.toString());
    return {
      error: err.toString(),
    };
  }
}
