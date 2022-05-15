import ExpSession from "express-session";
import { log, config } from "../../../reExports.js";
export function getMiddleExpSession(sessionStore) {
  try {
    const middleExpSession = function (socket, next) {
      log.info("Вызов getMiddleExpSession");
      //!
      const eSession = ExpSession({
        name: config.server.cookieNameSocket, // + "_s",
        //genid: () => uuidv4(),
        secret: config.server.secretSession,
        cookie: { secure: true, sameSite: true, maxAge: 60 * 60 * 1000 * 24 }, //24
        resave: false, // false - не пересохранять сессиию если ничего не менялось  //! Изучать!!
        saveUninitialized: false, // если true, то в хранилище будут попадать пустые сессии? false - Сеанс не инициализируется, если он новый, но не изменен
        // rolling: true, // нужно ли устанавливать идентификатор сессии cookie на каждый запрос
        store: sessionStore,
        proxy: true, // trustProxy
      });
      //!
      function nextLocal(err) {
        if (err)
          log.err("Ошибка при работе ExpSession middleware %s", err.message);
        socket.request.session.a = "2";
        // socket.request.session.save((err) => {
        //   if (err) log.error("err new expressSession %s", err.message);
        // });
        // log.warn("new expressSession %s", socket.request.session.req.res);
        next(err); // передаем дальше
      }
      // if (socket.request.res) eSession(socket.request, socket.request.res, next);
      // else
      eSession(socket.request, {}, nextLocal);
      //
    };
    return middleExpSession;
  } catch (err) {
    log.error("Error middle-ExpSession %s", err.message);
  }
}
/* пример переделки express middle  в socket middleware
const wrap = (middleware) => (socket, next) => {
  middleware(socket.request, {}, next);
};
*/
