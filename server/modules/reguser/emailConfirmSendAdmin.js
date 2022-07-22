/**
 * Отправляем письмо Пользователю
 */
import { sendMail } from "../mailer/sendMail.js";
import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { rootDir } from "../../dirModule.cjs";
import { botSendMessage } from "../../tg/startTgBot.js";
import path from "path";
import nunjucks from "nunjucks";
//import { v4 as uuidv4 } from "uuid";
import { readFileSync } from "fs";
async function emailConfirmSendAdmin(idUser, host, email) {
  let sqlP = /*sql*/ `
     select array_to_string(ARRAY(
         SELECT email FROM users
          WHERE 'ADMIN_EMAIL' = ANY(roles))
          ,',') AS emails
  
  `;
  let emailsadmin = null;
  try {
    emailsadmin = await pool.query(sqlP);
    console.log("Почта для отправки админам: ", emailsadmin);
    emailsadmin =
      emailsadmin?.rowCount > 0 ? emailsadmin.rows[0]?.emails : null;
  } catch (err) {
    console.log(
      "Ошибка поиска, Email администраторов для отправки подтверждения"
    );
    emailsadmin = null;
  }
  if (!emailsadmin) {
    console.log("Не нашли админов для почты");
    return;
  }

  try {
    // let nunj = nunjucks.configure("", {
    //   autoescape: true,
    // });
    let htm = await readFileSync(
      path.join(rootDir, "modules", "reguser", "mailconfadmin.html"),
      "utf8"
    );
    // let nunj = new nunjucks.renderString(htm);

    let subject = "Подтверждение регистрации";

    // let dateStart = Date.now();
    //console.log(uuidStr);
    console.log("шаблон для", email);
    let html = nunjucks.renderString(htm, {
      path: "https://" + host + "/departments",
      code: email || "не понятненько",
      email: email || "не понятненько",
    });

    let resSendMail = await sendMail(emailsadmin, "test", html, subject); //retrun / result/error
    let mess = "Отправка подтверждения админу" + emailsadmin;
    botSendMessage(mess);
    if (resSendMail.error) return resSendMail;
    mess = "Отправлено подтверждения" + emailsadmin;
    botSendMessage(mess);
    return {
      result: true, // отдадим код для сохранения в базе.
    };
  } catch (e) {
    console.log("Ошибка отправки подтверждения админу", e.message);
    return {
      error: e.message,
    };
  }
}
export { emailConfirmSendAdmin };

//await sendEmailConfirm();
