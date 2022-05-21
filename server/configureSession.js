import expressSession from "express-session";
import { redisStore, redisClient } from "./utils/ioredisStore.js";

export function configureSession(app) {
  /**
   * создадим функцию для сессии чтоб запихивать юзера при логине и регенерировать сессию
   * вызывать надо как req.session.login  из за this в функции
   */
  expressSession.Session.prototype.login = function (user) {
    const req = this.req;
    req.session.regenerate(function (err) {
      if (err) {
        console.log("Ошибка регенерации сессии при логине");
        return;
      }
      // здесь новая сессия
      console.log("записали сессию");
      req.session.user = user;
      req.session.user.sid = req.sessionID; // ??
      req.session.cookie.maxAge = 8 * 24 * 60 * 60 * 1000; // дней сек мин часы 1000  8дней
    });
  };
  // ------- expressSession
  /**
   * подаем app
   * вернем expSession
   */
  let expSession = expressSession({
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET, // Любой ключ но требуется переменная SESSION_SECRET
    cookie: {
      secure: true, //! nginx: proxy_set_header x-forwarded-proto https; и это: app.set("trust proxy", 1);
      sameSite: true,
      httpOnly: true, //!true
      maxAge: 1 * 60 * 1000, //7 * 24 * 60 * 60 * 1000, // дней сек мин часы 1000
    },
    resave: true, // false - не пересохранять сессиию если ничего не менялось
    saveUninitialized: false, // если true, то в хранилище будут попадать пустые сессии
    rolling: true, // нужно ли устанавливать идентификатор сессии cookie на каждый запрос
    //store: redisStore,
    store: new redisStore({
      client: redisClient,
      // ttl: 86400, // 1 день , если не указан,  берется из cookie maxAge
      // prefix: "sess" // по умолчанию sess
      // disableTouch: false // false по умолчанию, express-session посылает сигнал для обновления, даже если не было изменений в сессии
      //               чтоб сказать что сеанас активный и не стоит удалять. true скажет не обновлять ttl и сеанс закончится если сессия не изменялась.
      // disableTTL: false // полостью отключит время истечения ключа, навечно сохранит данные :) пока не удалишь в ручную.
    }),
    // store: new pgSession({
    //   pool: pool, // Connection pool
    // }),
  });

  app.use(expSession);
  // проверка на ошибку содания сессии
  app.use((req, res, next) => {
    if (!req.session) {
      console.log("Ошибка: session не создана! (редис ?)");
      //return next(new Error("oh no")) // handle error
    }
    next(); // otherwise continue
  });
  // --------------- меняем время жизни
  app.use((req, res, next) => {
    if (!req.session?.createdAt) {
      // даты у сессии не было , создадим
      req.session.createdAt = Date.now();
    }
    if (!req?.session?.user?.active) {
      // пользователя еще нет, сессию уменьшим выставим на 30 мин
      req.session.cookie.maxAge = 1 * 60 * 1000; // 30 мин
    } else {
      // сессия не обновляет данные из установленного куки.
      req.session.cookie.maxAge = 8 * 24 * 60 * 60 * 1000; // дней сек мин часы 1000  7дней
    }
    next();
  });
  return expSession;
}
