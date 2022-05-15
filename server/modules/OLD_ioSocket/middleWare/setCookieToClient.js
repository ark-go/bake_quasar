import { log, config } from "../../../reExports.js";
import signature from "cookie-signature";
import cookie from "cookie";
// установит куку если вызвать в "connect"
export function setCookieToClient(socket, next) {
  try {
    //var signed = "s:" + signature.sign(sessId, config.server.secretSession); //socket.request.sessionID
    var signed = "s:" + signature.sign(socket.id, config.server.secretSession); //socket.request.sessionID
    // console.log(signed);
    var data = cookie.serialize(
      config.server.cookieNameSocket + "K",
      signed,
      {
        path: "/",
        // _expires: 2021-04-08T12:01:10.611Z,
        maxAge: 60 * 60 * 24 * 2, //
        // originalMaxAge: 86400000,
        //   httpOnly: true,
        secure: true,
        sameSite: true,
      }
      //socket.request.session.cookie.data
    );
    function setHeader(headers) {
      log.info("Установка Cookie здесь !!!!");
      headers["set-cookie"] = data; // `qweerty=${socket.request.sessionID};${socket.request.session.cookie}`;
    }
    //console.log(socket.conn.transport);
    socket.conn.transport.removeAllListeners("headers");
    socket.conn.transport.once("headers", setHeader);
    next();
  } catch (err) {
    console.error("Error setCookieToClient: ", err);
  }
}
