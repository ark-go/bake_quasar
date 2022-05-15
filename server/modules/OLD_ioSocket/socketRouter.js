import { log, uuidv4 } from "../../reExports.js";
import {
  registerUser,
  loginUser,
  getCaptcha,
  checkCaptcha,
  soglasie,
  sendLogPass,
  testSize,
  testData,
  sendAuthCode,
  logoutUser,
} from "../../utils/allCommands.js";
/**
 * Диспетчер команд
 */
const commands = {
  soglasie,
  getCaptcha,
  registerUser,
  loginUser,
  checkCaptcha,
  testSize,
  sendLogPass,
  sendAuthCode,
  logoutUser,
};

const commandsWithCsrf = {
  // formData, // test
  testData, // test
};

export async function socketRouter(socket, route, [data, fun, ...args]) {
  log.info("Команда с клиента: %s", route);
  let cookieExpires = false; // может кука кончается
  if (socket.request.session?.cookie?.maxAge) {
    let maxCookieTime = socket.request.session.cookie.maxAge;
    log.warn("Время куки осталось %s сек.", maxCookieTime);
    if (maxCookieTime < 1000 * 60 * 1) {
      // 1000 секунда 60 минута * 60 час * 24 день * x кол-во дней
      cookieExpires = true;
    }
  }
  /**
   * промежуточнй шлюз - на возврате выполненной команды
   * перепишем и добавим в ответ CSRF
   * @param {} fdata
   */
  function funAddCsrf(fdata) {
    socket.csrf = uuidv4(); // новый Csrf
    fdata.csrf = socket.csrf;
    fun(fdata);
  }
  /* e  slint-disable no-alert, no-console */
  if (commands[route]) {
    // команды не требующие CSRF
    await commands[route](socket, data, funAddCsrf);
  } else if (commandsWithCsrf[route]) {
    // Команды требующие CSRF
    //await new Promise((res) => setTimeout(() => res(), 15000)); // test
    //console.log("csrf:", data.csrf, socket.csrf);
    if (data.csrf !== socket.csrf) {
      fun({
        success: false,
        errorMessage: "invalid CSRF",
      });
    } else {
      // запуск
      await commandsWithCsrf[route](socket, data, funAddCsrf);
      if (cookieExpires) socket.emit("cookieExpires", {}); // если кука истекает попросить обновить ее
    }
  } else {
    log.error("Неизвестная команда !! [%s]", route);
    fun({
      success: false,
      errorMessage: "Не известная команда: " + route,
    });
  }
}
