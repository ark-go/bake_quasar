import io from "socket.io-client";
const socket = io("/", {
  path: "/z/socket.io",
  autoConnect: false, // default true
  reconnection: true,
  withCredentials: true,
  auth: { token: Cookies.getJSON("__Host-ani_XUC")?.id },
  extraHeaders: {
    "set-ani-cookie": "no", // будем использовать для установки куки после регистрации
  },
});

async function startSocketClient() {
  console.log("Сохраненный стор", sStore);
  sStore.commit("common/isEnabledIO", true); // разрешаем пользоваться сокетом
  socketEvents(); //Подключаем остальные какие либо события
  socketEventsSystem();
  //await socketReconnect(socket);
  socket.connect();
}

export { startSocketClient };
