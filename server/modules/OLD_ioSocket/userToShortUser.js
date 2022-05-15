import { log } from "../../reExports.js";
/**
 * Пререводим объект User из  сессии в короткий отфильтрованный объект ShotUser
 * и прицепляем его к Socket
 * @param {*} socket
 * @returns  userShort
 */
export function userToShortUser(socket) {
  if (socket.userShort) socket.oldUsername = socket.userShort.username; // сохраним комнату в которой возможно был юзер

  if (socket.request.session?.user) {
    const user = socket.request.session.user;
    const userShort = ["email", "username", "permissions"].reduce(function (
      r,
      e
    ) {
      r[e] = user[e];
      return r;
    },
    {});
    socket.userShort = userShort;
  } else {
    socket.userShort = {
      email: "nouser@nouser.no",
      username: "Гость",
      roles: [],
      permissions: {},
    };
  }
  return socket.userShort;
}
