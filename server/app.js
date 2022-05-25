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
import { bot, botSendMessage } from "./tg/startTgBot.js";
import { configureSession } from "./configureSession.js";
import {
  rateLimiterMiddleware,
  rateLimiterMiddlewareLogin,
} from "./utils/rateLimiterMiddleware.js";
// globalThis.tgBot = function (message, id = process.env.TG_adminId) {
//   try {
//     bot.telegram.sendMessage(id, message);
//   } catch (e) {
//     console.log("Ошибка бота", e);
//   }
// };
// tgBot("Старт сервер.");
botSendMessage("Старт сервера");
const pgSession = connectPg(expressSession);
// --- -- -- - -- - -- -

// --- ----- -- - -- - -- -- -
let app = express();
app.set("trust proxy", 1); // ..говорим что доверяем первому прокси и верим что там https

app.use("/api/login/", rateLimiterMiddlewareLogin);
app.use("/api/", rateLimiterMiddleware);
app.use(cookieParser());
// ---------------------- helmet
app.use(helmet());
//app.use(helmet.xssFilter()); // ARK: Обязательно проверить в Nginx и там установить !! add_header X-XSS-Protection "1; mode=block";
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.2.0" }));
app.disable("x-powered-by");
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(noCache());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "frame-src": ["'self'", "'unsafe-inline'", "data:"],
      "media-src": ["'self'", "https:", "data:"],
      "worker-src": ["'self'", "data:"],
      "script-src-elem": ["'self'", "'unsafe-inline'"],
      // "default-src": ["'self'", "'unsafe-inline'", "data:"],
      "img-src": ["'self'", "data:"],
      "object-src": ["'self'", "https:", "data:"],
      // frameAncestors: ["img-src", "'self'", "https:", "data:"],
      // frameAncestors: ["object-src", "'self'", "data:"],
      //  "script-src": ["'unsafe-inline'"],
    },
  })
);
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       frameAncestors: ["'self'", "https:", "data:"],
//       frameAncestors: ["img-src", "'self'", "https:", "data:"],
//       frameAncestors: ["object-src", "'self'", "https:", "data:"],
//       frameAncestors: ["frame-src", "'self'"],
//       // "font-src": ["'self'", "https:", "data:"],
//       // "style-src": ["'self'", "'unsafe-inline'"],
//     },
//   })
// );
app.use(function (req, res, next) {
  // разрешаем грузить изображения с URL-адресами данных и PDF в том числе
  // res.setHeader("Content-Security-Policy", "img-src 'self' 'data:';");
  //res.setHeader("Content-Security-Policy", "frame-ancestors data:;");
  return next();
  // https://lollyrock.com/posts/content-security-policy/
  // шрифты Content-Security-Policy "font-src 'self' data:;"
  // стили CSS Content-Security-Policy "style-src 'self' 'unsafe-inline';"
  // CORS на другие сайты Content-Security-Policy "connect-src 'self' https://apis.google.com;"
});

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

app.use((req, res, next) => {
  res.append(
    "x-info-site",
    req.session?.user?.active ? req.session?.user?.active : "NoLogin"
  ); // NoLogin - служебное слово
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
      console.log("rout", route);
      route && routes.push(route);
    });
  }
});
console.log("Роуты", routes.length, routes);
//---------------------- конец роутов
export { app, expSession };
