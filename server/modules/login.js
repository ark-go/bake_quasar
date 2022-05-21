import { pool } from "../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../tg/startTgBot.js";
import { FA2qrcode, FA2verify, getToken2FA } from "../utils/speakeasy.js";
import { comparePassword } from "./passwordHash.js";
import { update2FA } from "../postgreSQL/command/update2FA.js";
import { updateActiveUser } from "../postgreSQL/command/updateActiveUser.js";
export async function login(req, res) {
  //res.json("USER: " + req.session?.user);
  console.log("body", req.body.login);
  if (!req.body.login || !req.body.password) {
    res.json({
      error: "Не указан логин/пароль",
    });
  } else {
    await getUser(req, res);
  }
}

async function getUser(req, res) {
  let login = req.body.login.toLowerCase();
  let sqlP = {
    text: `
         select * from users where email = $1;
        `,
    values: [login],
  };
  let result = await pool.query(sqlP);
  //console.log("userLoad", res);
  result = result.rowCount > 0 ? result.rows[0] : null;
  // req.session.test = { rr: "ЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖ" };
  if (result) {
    console.log("Найдены данные для:", result?.email);
    req.session.user = {
      ...req.session.user, // там информация о предвходе Tmp-данные
      ...{
        sid: req.sessionID,
        id: result.id,
        username: result.username,
        email: result.email,
        fa2code: result.fa2code,
        telegramId: result.telegramId,
        roles: result.roles || [],
        //  active: result.active,
      },
    };
    // ----------------------- Пароль ---
    let verifyPass = comparePassword(req.body.password, result.password);
    if (!verifyPass) {
      console.log("Ошибка пароля:", req.session?.user?.email);
      res.json({
        error: "Не подходят данные, для авторизации",
      });
      return;
    }
    // ----------------------------------
    // Проверка 2FACode, новый или старый отправим QRCode пользователь
    console.log(
      "start login",
      result.fa2code,
      req.session?.userTmp?.fa2codeTemp
    );
    if (!result.fa2code && !req.session?.userTmp?.fa2codeTemp) {
      // нет в базе и нет в темпе
      // нет 2FA кода, будем создавать
      let code = await create2FACode();
      req.session.userTmp = req.session.userTmp || {}; // если еще нету то создадим
      req.session.userTmp.fa2codeTemp = code.base32secret;
      req.session.userTmp.fa2codeImageTemp = code.QRCodeUrl;
      console.log("kod:", code.base32secret);
      res.json({
        username: result.username,
        email: result.email,
        QRCodeUrl: code.QRCodeUrl,
      });
      return;
    } else {
      //! Здесь мы длжны проверить код 2FA
      // if(result.fa2code){

      // }

      let verifyToken = false;
      // код 2Фа есть в базе, регистрация устройства была
      if (result.fa2code) {
        // если в базе уже зарегистрирован код, то проверим токен, введенный пользователем
        verifyToken = await FA2verify(req, result.fa2code, req.body.FA2token);
        let token = getToken2FA(req, result.fa2code);
        // если код введенный пользователем не подошел, отправим в телеграмм нужный код
        if (!verifyToken) {
          let sec = 60 - new Date().getSeconds();
          sec = sec > 30 ? sec - 30 : sec; // 30 сек время действия кода
          botSendMessage(
            "Ваш токен: " + token + " ( " + sec + " сек. осталось )"
          );
        }
      } else {
        // в базе нет но есть в темпе проверяем по нему
        verifyToken = await FA2verify(
          req,
          req.session.userTmp.fa2codeTemp,
          req.body.FA2token
        );
        console.log(
          "проверка токена регистрации:",
          req.session?.user?.email,
          verifyToken
        );

        if (!verifyToken) {
          // Проверка первого токена не прошла - отправим туже картинку которая и была
          res.json({
            error: "Проверьте все данные!",
            username: result.username,
            email: result.email,
            QRCodeUrl: req.session.userTmp.fa2codeImageTemp,
          });
          return;
        }
        // запись кода устройства в базу юзеру
        let updFa = await update2FA(
          req.session?.user?.id,
          req.session.userTmp.fa2codeTemp
        );
        if (updFa) {
          delete req.session.userTmp;
          let active = await updateActiveUser(req.session?.user?.id, true);
          req.session.user.active = active;
          if (!active) {
            delete req.session.user; // выкидываем пользователя из сессии
            res.json({
              error: "Ошибка при активации пользователя",
            });
          }
        }
      }

      if (!verifyToken) {
        //delete req.session.user; // выкидываем пользователя из сессии
        console.log("Токен 2FA не прошел.");
        res.json({
          error: "Не подходят данные, для авторизации",
        });
        return;
      } else {
        // Подключились да??
        delete req.session.userTmp;
        let active = await updateActiveUser(req.session?.user?.id, true);
        req.session.user.active = active;
        req.session.login(req.session.user); //! Внимание !
        res.json({ loginYes: true });
      }
      return;
    }
  } else {
    // пользователя нет в базе
    res.json({
      error: "Не подходят данные, для авторизации", //Не найден пользователь",
    });
    return;
  }
}

async function create2FACode() {
  let code = await FA2qrcode(); // без параметров новый ключ
  return code;
}
