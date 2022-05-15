import { log, config } from "../../reExports.js";
import signature from "cookie-signature";
import cookie from "cookie";
// установит куку если вызвать в "connect"
export function setCookieToClient(socket, next) {
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
      httpOnly: true,
      secure: true,
      sameSite: true,
    }
    //socket.request.session.cookie.data
  );
  socket.conn.transport.once("headers", (headers) => {
    log.warn("УСТАНОВКА ХЕДЕРА ЗДЕСЬ !!!!");
    headers["set-cookie"] = data; // `qweerty=${socket.request.sessionID};${socket.request.session.cookie}`;
  });
  next();
}
