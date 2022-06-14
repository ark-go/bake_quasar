import { FA2qrcode, FA2verify, getToken2FA } from "../../utils/speakeasy.js";
import { saveUserRegister } from "./saveUserRegister.js";
import escape from "pg-escape";
import { emailConfirmSend } from "./emailConfirmSend.js";
import { emailConfirmSave } from "./emailConfirmSave.js";
import { getHashPassword } from "./passwordHash.js";
import { findCodeConfirm } from "./findCodeConfirm.js";
import { emailConfirmDelete } from "./emailConfirmDelete.js";
import { emailConfirmFindUser } from "./emailConfirmFindUser.js";
//import { update2FA } from "../../postgreSQL/command/update2FA.js";
async function reguser(req, res) {
  if (req.body.qrCode) {
    //? Пришел код QRCode

    console.log("передали код", req.body);
    if (!req.session?.userTmp?.fa2code || !req.session?.userTmp?.password) {
      console.log(
        "передали код а время кончилось",
        req.body,
        "Сессия:",
        req.session
      );
      return {
        error:
          "Ошибочный запрос, или закончилась сессия для подтверждения кода",
      };
    }
    if (req.body.rePassword != req.session.userTmp.password) {
      return {
        error: "Пароль не совпадает",
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
    let resfind = await emailConfirmFindUser(req.session.userTmp);
    if (resfind.result) {
      // уже есть пользователь
      return {
        error:
          "Такой email уже зарегистрирован, обратитесь к администратору, что бы сбросить регистрацию ",
      };
    }

    //? Код запишем в базу, пока без пароля
    let res = await saveUserRegister(
      req.session.userTmp,
      req.session.userTmp.fa2code
    );
    if (res.error) {
      // Юзера не записали
      //! или была поdсторная регистрация , что с этм делать.
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
      // пользователю не отправили письмо - его надо удалить!!!
      let resdel = await emailConfirmDelete(res.result?.id);
      if (resdel.error) {
        return {
          error: "Произошла ошибка при регистрации 135",
        };
      }
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
    // возвращаем как есть, то что вернет pg
    return resSave;
  }
  if (req.body.code && req.body.id) {
    let resCode = await findCodeConfirm(req.body.id, req.body.code);
    if (resCode.error) {
      return {
        error: resCode.error,
      };
    }
    if (resCode.result) {
      console.log("Нашли код подтверждения:", resCode);
      return {
        result: "Код найден. Вы зарегистрированы!",
      };
    }
    return {
      error: "Не найден код для подтверждения",
    };

    // Прислан код из письма
  }
  //? Не было QRCode  и не было code подтверждения из БД
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
  // req.session.cookie.maxAge = timerDelay;
  // req.session.save(function (err) {
  //   // session saved
  //   console.log(
  //     "записываем сессию для регистрации телефона: ",
  //     req.session.cookie.maxAge
  //   );
  // });
  return {
    result: {
      QRCodeUrl: code.QRCodeUrl,
      timerDelay: timerDelay / 1000 - 30, // на 30 сек меньше..
    },
  };
}
// function registrationUser(){
//     saveUser() {}
// }
// saveUser() {}

export { reguser };
