import { Server } from "socket.io";
import { log } from "../../reExports.js";
import { expressSession } from "./middleWare/expressSession.js";
import { testInfo } from "./middleWare/testInfo.js";
import { testSessionAndCsrf } from "./middleWare/testSessionAndCsrf.js";
import { onConnect } from "./onConnect.js";
import { setCookieToClient } from "./middleWare/setCookieToClient.js";

export function initSoket(server, expSession /*sessionStore*/) {
  const io = new Server(server, {
    cors: {
      // origin: "" // наш адрес сюда с портом
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  log.warn("Старт сервера SocketIo!");
  //console.log("LLLLLLLLLLLLL", io);
  // io.listener.prototype._onConnectionOld = io.listener.prototype._onConnection;
  // io.listener.prototype._onConnection = function (
  //   transport,
  //   req,
  //   res,
  //   up,
  //   headv
  // ) {
  //   req.socketIOTransport = transport; // Take note of the transport type
  //   this._onConnectionOld.call(this, transport, req, res, up, head);
  // };
  //io.use(getMiddleExpSession2(sessionStore));
  io.use(expressSession(expSession));
  io.use(testInfo); // служебная инфа на консоль
  io.use(testSessionAndCsrf); // Auth доступ тут можно запретить
  io.use(setCookieToClient);
  io.on("connect", (socket) => onConnect(socket));
}

// function cookieInfo(socket) {
//   try {
//     const cookies = cookie.parse(socket.handshake.headers.cookie || "");
//     let id = cookies && cookies[config.server.cookieNameSocket];
//     id = id.substring(2);
//     log.warn(
//       "TEST cookie: %s",
//       signature.unsign(id, config.server.secretSession)
//     );
//     log.warn("TEST session: %s", socket.request.sessionID);
//     return true;
//   } catch (e) {
//     log.error("TEST cookie:  Error!", e);
//     return false;
//   }
// }
