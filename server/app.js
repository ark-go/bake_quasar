import express from "express";
import path from "path";
import csrf from "csurf";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import noCache from "nocache";
import bodyParser from "body-parser";
import { pool } from "./postgreSQL/initPostgreSQL.js";
import connectPg from "connect-pg-simple";
import { rootDir } from "./dirModule.cjs";
import { mainRoutes } from "./routes/mainRoutes.js";
import { botSendMessage } from "./tg/startTgBot.js";
import { configureSession } from "./configureSession.js";
import {
  rateLimiterMiddleware,
  rateLimiterMiddlewareLogin,
  rateLimiterMiddlewareRegUser,
} from "./utils/rateLimiterMiddleware.js";
botSendMessage("Старт сервера");

let app = express();
app.set("trust proxy", 1); // ..говорим что доверяем первому прокси и верим что там https
app.use("/api/reguser/", rateLimiterMiddlewareRegUser);
app.use("/api/login/", rateLimiterMiddlewareLogin);

app.use("/api/", rateLimiterMiddleware);
app.use(cookieParser());
// ---------------------- helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
//app.use(helmet.xssFilter()); // ARK: Обязательно проверить в Nginx и там установить !! add_header X-XSS-Protection "1; mode=block";
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.2.0" }));
app.disable("x-powered-by");
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(noCache());
console.log("host: ", process.env.CSP_HOST_NAME);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "frame-src": ["'self'", "'unsafe-inline'", "blob:", "https:", "data:"],
      "media-src": ["'self'", "blob:", "https:", "data:"],
      "worker-src": ["'self'", "blob:", "data:"],
      "script-src-elem": ["'self'", "'unsafe-inline'"],
      // "default-src": ["'self'", "'unsafe-inline'", "data:"],
      "img-src": ["'self'", "blob:", "data:"],
      "connect-src": ["'self'", "wss:", "blob:", "data:"],
      //   process.env.CSP_HOST_NAME,
      "object-src": ["'self'", "blob:", "https:", "data:"],
      frameAncestors: ["'self'", "wss:", "blob:", "https:", "data:"],
      //frameAncestors: ["object-src", "'self'", "blob:", "https:", "data:"],
      // frameAncestors: ["connect-src", "'self'", "blob:", "https:", "data:"],
      //  "script-src": ["'unsafe-inline'"],
    },
  })
);
// app.use(function (req, res, next) {
//   // разрешаем грузить изображения с URL-адресами данных и PDF в том числе
//   // res.setHeader("Content-Security-Policy", "img-src 'self' 'data:';");
//   //res.setHeader("Content-Security-Policy", "frame-ancestors data:;");
//   return next();
//   // https://lollyrock.com/posts/content-security-policy/
//   // шрифты Content-Security-Policy "font-src 'self' data:;"
//   // стили CSS Content-Security-Policy "style-src 'self' 'unsafe-inline';"
//   // CORS на другие сайты Content-Security-Policy "connect-src 'self' https://apis.google.com;"
// });

//----------------------- bodyparser
app.use(
  bodyParser.json({
    limit: "30mb",
  })
); // ,type:'application/json'
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "30mb",
    parameterLimit: 300,
  })
);
const expSession = configureSession(app);

// изменение Redis? изменения session переписывают redis //

import { redisSetUserReload } from "./utils/redis/redisSetUserReload.js";
if (process.argv.length > 2 && process.argv[2] == "reload") {
  let m = async () => {
    await redisSetUserReload("all");
  };
  m();
}
// для чтения юзера из базы
import { loadUserToReq } from "./modules/reguser/loadUserToReq.js";
//await redisSetUserReload(90);
app.use(async (req, res, next) => {
  if (req?.session?.user?.isReloadUser) {
    //установлен флаг о необходимости перечитать Юзера из базы.
    let userFromBase = await loadUserToReq(req);
    req.session.user.isReloadUser = false;
    console.log("----Был знак: ", req?.session?.user?.id);
    if (userFromBase) {
      delete userFromBase.password;
      delete userFromBase.fa2code;
      req.session.user = userFromBase;
    }
  }
  next();
});

app.use((req, res, next) => {
  // if (req.session?.user?.status != "Registered") {
  //   res.append("x-info-site", "NoLogin");
  // } else {
  res.append(
    "x-info-site",
    req.session?.user?.status ? req.session?.user?.status : "NoLogin"
  ); // NoLogin - служебное слово
  // console.log("sess vhod:", req.session?.user);
  // }
  next();
});
app.use((req, res, next) => {
  let userBrowser = {};
  try {
    userBrowser = JSON.parse(req.cookies.browser);
  } catch (e) {
    process.stdout.write("Без куки о браузере\r");
  }
  let cookieTimezone = userBrowser?.timezone; // из куки
  let headerTimezone = req?.headers?.timezone; // из  axios
  let resTimezone = headerTimezone || cookieTimezone; // выберем что есть, сначала axios

  req.session.timezone = resTimezone || "Europe/Moscow"; // если ничего так и нет то москва
  req.session.userBrowser = userBrowser;
  req.session.ipAddress = req.headers["x-forwarded-for"];
  next();
});

await mainRoutes(app, express); // там расставляем роуты

// ---- csrf  подключим тут с пропуском проверки по post для /api
//app.use(csrf({ cookie: false, ignoreMethods: ["POST"] }));
// Прошли все роуты

// обработчик ошибок имеет 4 параметра первый err.
// он всегда в конце всех маршрутов
// обработчик ошибок разработки напечатает трассировку стека
// но сначала проерим csrf потом передадим ошибку дальше
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  console.log("! ===> Ошибка CSRF токена. ", "(" + err.status + ")");
  res.status(403).json({ error: "Запрещено!" }); // 419 csrf // 418 ...
});
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      errorStatus: err.status,
      error: "Проверьте URL1",
      errorStack: err.stack,
    });
  });
} else {
  // без стека
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      errorStatus: err.status,
      error: "Проверьте URL",
    });
    console.log("Ошибка X00:", err.message, "\rstack error:", err.status);
  });
}
//--------------------- прочитаем роуты ----
var route,
  routes = [];

app._router.stack.forEach(function (middleware) {
  if (middleware.route) {
    // routes registered directly on the app
    routes.push(middleware.route);
  } else if (middleware.name === "router") {
    // router middleware
    middleware.handle.stack.forEach(function (handler) {
      route = handler.route;
      // console.log("rout", route);
      route && routes.push(route);
    });
  }
});
//console.log("Роуты", routes.length, routes);
//---------------------- конец роутов
export { app, expSession };
