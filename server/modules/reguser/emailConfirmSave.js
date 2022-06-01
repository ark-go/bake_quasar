/**
 *  Шифруем и записываем пароль
 *  одновременно записываем код отправленный в письме для подтверждения
 */
import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";

// Temporary временный не подтвержден емайл
async function emailConfirmSave(id, pass, hashcode) {
  let tabname1 = "users_login";
  let tabname2 = "users_register";
  let qSql1 = /*sql*/ `
     update ${tabname1} set 
      password = $2,
      status = $3
      where id = $1;
  `;
  let qVal1 = [id, pass, "Registration"];
  let qSql2 = /*sql*/ `
    insert into ${tabname2} (id,check_mailcode,check_maildate)
       values($1,$2,CURRENT_TIMESTAMP);
`;
  let qVal2 = [id, hashcode];

  try {
    //let result = await pool.query(sqlP);
    //----------------------------------------------------------
    const client = await pool.connect();
    try {
      console.log("Старт транзакции emailConfirmSave.js");
      await client.query("BEGIN");
      const res = await client.query(qSql1, qVal1);
      await client.query(qSql2, qVal2);
      await client.query("COMMIT");
      console.log("Commit транзакции emailConfirmSave.js");
    } catch (e) {
      console.log("Откат транзакции emailConfirmSave.js");
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
    //-----------------------------------------------------------
    // console.log("Старт транзакции emailConfirmSave.js");
    // let result = pool.connect((err, client, done) => {
    //   const shouldAbort = (err) => {
    //     if (err) {
    //       console.error("Ошибка transaction", err.stack);
    //       client.query("ROLLBACK", (err) => {
    //         if (err) {
    //           console.error("Ошибка rolling back client", err.stack);
    //         }
    //         // выпустить клиента обратно в пул
    //         done();
    //       });
    //     }
    //     return !!err;
    //   };
    //   client.query("BEGIN", (err) => {
    //     if (shouldAbort(err)) return;
    //     client.query(qSql1, qVal1, (err, res) => {
    //       if (shouldAbort(err)) return;
    //       client.query(qSql2, qVal2, (err, res) => {
    //         if (shouldAbort(err)) return;
    //         client.query("COMMIT", (err) => {
    //           if (err) {
    //             console.error("Error committing transaction", err.stack);
    //           }
    //           // вернуть клиента в пул
    //           done();
    //         });
    //       });
    //     });
    //   });
    // });
    //-----------------------------------------------------------
    //result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add password and mailcode:` + "\n" + id;
    // console.log(mess, result);
    // mess += "\n" + JSON.stringify(result);
    botSendMessage(mess);
    return {
      result: id, //"Обновили пароль и сохранили код подтверждения", //
    };
  } catch (err) {
    console.log("Ошибка записи ", "emailConfirmSave.js", err.toString());
    return {
      error: err.toString(),
    };
  }
}

export { emailConfirmSave };
