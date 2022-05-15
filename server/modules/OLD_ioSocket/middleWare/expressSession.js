import { log } from "../../../reExports.js";
export function expressSession(expSession) {
  // используем существующий expSession
  // оригинал подписывает PGStore на событие, следить за этим!
  try {
    const middleExpSession = function (socket, next) {
      log.info("Вызов getMiddleExpSession");
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
      expSession(socket.request, {}, nextLocal);
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
