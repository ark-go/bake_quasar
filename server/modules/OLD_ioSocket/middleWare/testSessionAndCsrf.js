import { log } from "../../../reExports.js";
export function testSessionAndCsrf(socket, next) {
  log.info("Клиентов: %s", socket.server.engine.clientsCount);
  if (
    !socket.request.session?.startCsrf ||
    socket.handshake.auth?.token != socket.request.session?.startCsrf
  ) {
    //  setCookieToClient(socket, socket.id); //!
    log.error("Закрыто, запрос токена. %s", socket.id);
    next(new Error("хрен вам тут"));
  } else next();
}
