import { pool } from "../../postgreSQL/initPostgreSQL.js";
import { botSendMessage } from "../../tg/startTgBot.js";
import { FA2verify, getToken2FA } from "../../utils/speakeasy.js";
import { compareHashPassword } from "./passwordHash.js";

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
         select users_login.*,users.roles as roles from users_login 
         left join users on users.email = users_login.email
         where users_login.email = $1
        `,
    values: [login],
  };
  let result = await pool.query(sqlP);
  //console.log("userLoad", res);
  result = result.rowCount > 0 ? result.rows[0] : null;
  let UserBase = {};
  if (result) {
    UserBase = result;
    UserBase.sid = req.sessionID;
    console.log("Найдены данные для:", UserBase?.email);
    // ----------------------- Пароль ---
    let verifyPass = compareHashPassword(
      req.body.password,
      result.password,
      result.id
    );
    if (!verifyPass) {
      console.log("Ошибка пароля:", req.session?.user?.email);
      return res.json({
        error: "Не подходят данные, для авторизации",
      });
    }
    // ---- Пароль прошли ----- проверка 2FA ---------
    let verifyToken = await FA2verify(req, result.fa2code, req.body.FA2token);
    if (verifyToken) {
      //? Прошли пароль и код 2FA

      if (!Array.isArray(UserBase.roles)) {
        UserBase.roles = []; // не должно такого быть
      }

      UserBase.roles = [...new Set([...UserBase.roles, ...["USER"]])]; // ["USER"]; // req.session.user
      //req.session.user = { ...UserBase };
      console.log("raz id", UserBase.sid, UserBase.roles);
      req.session.user = UserBase;
      //req.session.login(UserBase);
      return res.json({
        result: "Добро пожаловать!",
      });
    }
    // --- 2Fa не прошёл  ----------
    if (result.fa2code) {
      // ------- код 2FA есть в базе и у пользователя есть телеграм
      if (result.telegram) {
        await sendTokenTG(req, result.fa2code);
      }
      return res.json({
        error: "Не подходят данные, для авторизации",
      });
    } else {
      return res.json({
        error: "Вам необходимо пройти регистрацию",
      });
    }

    // ----------------------------------
  } else {
    // пользователя нет в базе
    return res.json({
      error: "Не подходят данные, для авторизации", //Не найден пользователь",
    });
  }
}

function sendTokenTG(req, fa2code) {
  let token = getToken2FA(req, fa2code);
  let sec = 60 - new Date().getSeconds();
  sec = sec > 30 ? sec - 30 : sec; // 30 сек время действия кода
  botSendMessage(
    "Ваш токен: " +
      token +
      " ( " +
      sec +
      " сек. осталось )" +
      (sec < 15 ? " \nЖдите код." : "")
  );
  if (sec < 15) {
    let timer = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      let token = getToken2FA(req, fa2code);
      let sec = 60 - new Date().getSeconds();
      sec = sec > 30 ? sec - 30 : sec; // 30 сек время действия кода
      botSendMessage("Ваш токен: " + token + " ( " + sec + " сек. осталось )");
    }, (sec + 2) * 1000);
  }
}
