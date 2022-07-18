/**
 * Отправляем письмо Пользователю
 */
import { sendMail } from "../mailer/sendMail.js";
import { rootDir } from "../../dirModule.cjs";
import { botSendMessage } from "../../tg/startTgBot.js";
import path from "path";
import nunjucks from "nunjucks";
import { v4 as uuidv4 } from "uuid";
import { readFileSync } from "fs";
async function emailConfirmSendAdmin(idUser, host, userTmp) {
  // userTmp.email
  return;
  try {
    // let nunj = nunjucks.configure("", {
    //   autoescape: true,
    // });
    let htm = await readFileSync(
      path.join(rootDir, "modules", "reguser", "mailconf.html"),
      "utf8"
    );
    // let nunj = new nunjucks.renderString(htm);

    let subject = "Подтверждение Email";
    let uuidStr = uuidv4();
    // let dateStart = Date.now();
    //console.log(uuidStr);

    let html = nunjucks.renderString(htm, {
      path: "https://" + host + "/registration/" + idUser + "/" + uuidStr,
      code: uuidStr,
      email: email,
    });

    let resSendMail = await sendMail(email, "test", html, subject); //retrun / result/error
    let mess = "Отправка подтверждения" + email;
    botSendMessage(mess);
    if (resSendMail.error) return resSendMail;
    mess = "Отправлено подтверждения" + email;
    botSendMessage(mess);
    return {
      result: uuidStr, // отдадим код для сохранения в базе.
    };
  } catch (e) {
    return {
      error: e.message,
    };
  }
}
export { emailConfirmSendAdmin };

//await sendEmailConfirm();
