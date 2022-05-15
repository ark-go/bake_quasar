import { log, uuidv4 } from "../../reExports.js";
import { userToShortUser } from "./userToShortUser.js";
import { sendCurrentUser } from "../sendCommands/sendCurrentUser.js";
import { socketRouter } from "./socketRouter.js";
import { setCookieToClient } from "./middleWare/setCookieToClient.js";
export async function onConnect(socket) {
  log.warn("Connect .... sessionID: %s", socket.request.sessionID);
  log.warn("Connect .... socketID: %s", socket.id);
  if (!socket.request.session) log.error("НЕТ сессии  НЕ зарегистрирован");
  socket.csrf = uuidv4();
  socket.sessionID = socket.request.sessionID;
  // ----------- отправка куки клиенту (перенести в регистрилку)
  // нельзя перенести, регистрация куки возможно только в "connect"
  //await setCookieToClient(socket, () => {});
  // вероятно надо для сдвига времени в куке, проверить!!
  // ------------------------------------------------------------------
  await userToShortUser(socket);
  socket.join([socket.userShort.username, "everyone"]); // в группу
  await sendCurrentUser(socket);

  socket.on("disconnect", async () => {
    log.warn(`disconnect-1 ${socket.id}`);
    await sendCurrentUser(socket);
  });

  socket.onAny(async (event, ...args) => {
    log.info("Клиентов any: %s", socket.server.engine.clientsCount);
    // console.log("COnnect++++++:", socket);
    //!setCookieToClient(socket, socket.request.sessionID); // тут оно вроде как не срабатывает
    //! кстати  это ругается на память Possible EventEmitter memory leak detected.
    // 11 headers listeners added to [WebSocket]. Use emitter.setMaxListeners() to increase limit
    // 11 слушателей заголовков добавлены в... "(once("headers"....)"
    await socketRouter(socket, event, args); // В путь.
  });
}
