import { FA2qrcode, FA2verify, getToken2FA } from "../../utils/speakeasy.js";
import { saveUserRegister } from "./saveUserRegister.js";
import escape from "pg-escape";
import { emailConfirmSend } from "./emailConfirmSend.js";
import { emailConfirmSave } from "./emailConfirmSave.js";
import { getHashPassword } from "./passwordHash.js";
//import { update2FA } from "../../postgreSQL/command/update2FA.js";
async function reguser(req, res) {
  if (req.body.qrCode) {
  }
  if (req.body.code) {
  }
  if (!req.body.qrCode) {
    if (
      !req.body?.email?.trim() ||
      !req.body?.password?.trim() ||
      !req.body?.fam?.trim() ||
      !req.body?.name?.trim()
    ) {
      return {
        error: "Не все данные введены!",
      };
    }
    try {
      req.body.email = escape(req.body.email.trim());
      req.body.fam = escape(req.body.fam.trim());
      req.body.name = escape(req.body.name.trim());
    } catch (e) {}

    // нет кода регистрации qrCode, выдадим изображение
    console.log("reguser", req.body);
    let code = await FA2qrcode();
    req.session.userTmp = req.session.userTmp || {}; // если еще нету то создадим
    req.session.userTmp = { ...req.body };
    req.session.userTmp.fa2code = code.base32secret;
    // req.session.userTmp.fa2codeImage = code.QRCodeUrl;
    //console.log("kod:", req.session.userTmp);
    // Увеличим время жизни сессии для того чтоб успели завести код в приложение
    let timerDelay = 10 * 60 * 1000; // 10 мин;
    req.session.cookie.maxAge = timerDelay;
    return {
      result: {
        QRCodeUrl: code.QRCodeUrl,
        timerDelay: timerDelay / 1000 - 30, // на 30 сек меньше..
      },
    };
  } else {
    console.log("передали код", req.body);
    if (!req.session?.userTmp?.fa2code) {
      console.log("предали код а время кончилось", req.body);
      return {
        error:
          "Ошибочный запрос, или закончилась сессия для подтверждения кода",
      };
    }
    //? прислан код регистрации qrCode
    let verifyToken = await FA2verify(
      req,
      req.session.userTmp.fa2code,
      req.body.qrCode
    );
    if (!verifyToken) {
      return {
        error: "Не верный QR код",
      };
    }
    //? Код запишем в базу, пока без пароля
    let res = await saveUserRegister(
      req.session.userTmp,
      req.session.userTmp.fa2code
    );
    if (res.error) {
      // Юзера не записали
      return res;
    }
    // res.result.id - должен быть вставленный user ID
    //? Отправим письмо проверки E-mail
    let resEmail = await emailConfirmSend(
      res.result?.id,
      req.headers?.host,
      req.session?.userTmp?.email
      // req.session?.userTmp?.password
    );
    if (resEmail.error) {
      //! пользователю не отправили письмо - его надо удалить
      return resEmail;
    }
    let codeConfirm = resEmail?.result;
    console.log("email reg", resEmail);
    //let dateStart = Date.now();
    //? раз отправили письмо, запишем и код и пароль пользователя [код в почте, id юзера, хеш-пароль]
    let resSave = await emailConfirmSave(
      res.result?.id,
      getHashPassword(req.session?.userTmp?.password, res.result?.id),
      codeConfirm
    );

    return resSave;
  }
}
// function registrationUser(){
//     saveUser() {}
// }
// saveUser() {}

export { reguser };
