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
  if (result) {
    console.log("Найдены данные для:", result?.email);
    req.session.user = {
      ...req.session.user,
      ...{
        id: result.id,
        username: result.username,
        email: result.email,
        fa2code: result.fa2code,
        telegramId: result.telegramId,
        active: result.active,
      },
    };

    // Проверка 2FACode, новый или старый отправим QRCode пользователь
    if (!result.fa2code && !req.session?.user?.fa2codeTemp) {
      // нет в базе и нет в темпе
      // нет 2FA кода, будем создавать если подойдет пароль
      let verifyPass = comparePassword(req.body.password, result.password);
      if (!verifyPass) {
        console.log("Ошибка пароля:", req.session?.user?.email);
        delete req.session.user;
        res.json({
          error: "Не подходят данные, для авторизации",
        });
        return;
      }
      let code = await create2FACode();
      req.session.user.fa2codeTemp = code.base32secret;
      req.session.user.fa2codeImageTemp = code.QRCodeUrl;
      console.log("kod:", code.base32secret);

      res.json({
        username: result.username,
        email: result.email,
        QRCodeUrl: code.QRCodeUrl,
      });
      return;
    } else {
      //! Здесь мы длжны проверить код 2FA
      let verifyToken = false;
      // проверить пароль
      let verifyPass = comparePassword(req.body.password, result.password);
      console.log("Проверка пароля: ", verifyPass);
      if (verifyPass) {
        // паспорт проверили подходит
        if (result.fa2code) {
          // если в базе уже зарегистрирован код, то проверим токен
          verifyToken = await FA2verify(result.fa2code, req.body.FA2token);
          let token = getToken2FA(result.fa2code);
          botSendMessage(
            "Нужен токен: " + token + " введен токен: " + req.body.FA2token,
            req
          );
          //! telegran надо отправить
          if (!verifyToken) {
            let token = getToken2FA(result.fa2code);
            botSendMessage("Ваш токен: " + token, req);
          }
        } else {
          // в базе еще нет кода, пользуемся временным
          verifyToken = await FA2verify(
            req.session.user.fa2codeTemp,
            req.body.FA2token
          );
          console.log("проверка токена:", verifyToken);
          if (!verifyToken) {
            // Проверка первого токена не прошла - отправим туже картинку которая и была
            res.json({
              error: "Проверьте все данные!",
              username: result.username,
              email: result.email,
              QRCodeUrl: req.session.user.fa2codeImageTemp,
            });
            return;
          }
          let updFa = await update2FA(
            req.session?.user?.id,
            req.session.user.fa2codeTemp
          );
          if (updFa) {
            delete req.session.user.fa2codeTemp;
            delete req.session.user.fa2codeImageTemp;
            let active = await updateActiveUser(req.session?.user?.id, true);
            if (!active) {
              delete req.session.user; // выкидываем пользователя из сессии
              res.json({
                error: "Ошибка при активации пользователя",
              });
            }
          }
          // Записать в базу
          console.log("Теест: ", req.session.user);
        }
      }
      if (!verifyPass || !verifyToken) {
        delete req.session.user; // выкидываем пользователя из сессии
        console.log("Токен 2FA не прошел.");
        res.json({
          error: "Не подходят данные, для авторизации",
        });
        return;
      } else {
        // let active = await updateActiveUser(req.session?.user?.id,true);
        res.json({
          loginYes: true,
          username: result.username,
          email: result.email,
        });
      }
      return;
    }
  } else {
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
