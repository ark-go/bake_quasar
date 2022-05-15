import { log } from "../../../reExports.js";
export function testInfo(socket, next) {
  // console.log("sockie- sockie-sockie", socket.request.session);
  log.info("Token: %s", socket.handshake.auth?.token); //.handshake.headers);
  log.info("sCsrf: %s", socket.request.session?.startCsrf);
  // console.log("session id::", socket.request.sessionID);
  next();
}
