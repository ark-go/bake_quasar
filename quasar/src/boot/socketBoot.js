import { boot } from "quasar/wrappers";
import { useIoSocket } from "stores/ioSocket.js";
import { emitter } from "boot/axios";
import { soundPlay } from "src/utils/sound.js";
import { Notify } from "quasar";

export default boot(({ app }) => {
  const ioSocket = useIoSocket();
  const socket = ioSocket.start();
  socket.on("connect", () => {
    socket.removeAllListeners();
    // socket.off(); // удаляет всех слушателей
    ioSocket.onLine = true;
    socket.onAny((eventName, arg) => {
      // Все сообщения вообще рассылаем почемуто так ,,???
      // console.log("socket io onAny: ", eventName, arg);
      emitter.emit(eventName, arg);
    });
    // только после подключения будет ID socket
    console.log("IO connect", socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("HELL", (val) => {
      ioSocket.timeServer = val.date; //! что это
      ioSocket.versionSite = process.env.versionSite;
      console.log("Версия сайта:", ioSocket.versionSite);
    });
    socket.on("SOUND", (val) => {
      ioSocket.timeServer = val.date;
      // soundClick();
      soundPlay("/sound/kapli.mp3");
    });

    let timer = null;
    socket.on("updateSite", (val) => {
      ioSocket.timeServer = val.date;
      if (val.versionSiteServer != process.env.versionSite) {
        // не совпадает номер версии
        console.log(">>ver", val.versionSiteServer, process.env.versionSite);
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          notifSite();
        }, 30000);
      }
    });
  });
  socket.on("disconnect", () => {
    ioSocket.onLine = false; // undefined
  });

  console.log("IO транспорт", socket.io.engine.transport.name);
  socket.io.engine.on("upgrade", () => {
    console.log("IO Смена транспорта", socket.io.engine.transport.name); // in most cases, "websocket"
  });
  socket.on("connect_failed", function () {
    console.log("IO Connection Failed");
  });
  socket.on("connect_error", (err) => {
    console.log("IO connect_error ", err.message); // prints the message associated with the error
  });
  // socket.on("on-reload-tree", (val) => {
  //   emitter.emit("on-reload-tree", val);
  // });
  // =========================================================
});
function notifSite() {
  Notify.create({
    color: "green-6",
    textColor: "white",
    icon: "bolt",
    message: "На сервере другая версия сайта.",
    //caption: "Перегрузить окно",
    position: "top-left",
    // avatar,
    multiLine: true,
    timeout: 0,
    actions: [
      {
        label: "Потом",
        color: "green-3",
        handler: () => {
          /* console.log('wooow') */
        },
      },
      {
        label: "Перегрузить",
        color: "orange-3",
        handler: () => {
          window.location.reload(true);
          // отбросить POST данные
          //window.location.href = window.location.href;
        },
      },
    ],
  });
}
