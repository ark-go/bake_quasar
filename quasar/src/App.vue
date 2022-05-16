<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { io } from "socket.io-client";
import { useIoSocket } from "stores/ioSocket.js";
import { soundPlay } from "src/utils/sound.js";
import { useQuasar } from "quasar";
import { Cookies } from "quasar";
export default defineComponent({
  name: "App",
  setup() {
    Cookies.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone, {
      RR: "wert",
    });
    const { notify } = useQuasar();
    const ioSocket = useIoSocket();
    const socket = io();
    socket.on("connect", () => {
      // первый коннект, при обрывах после не срабатывает, сработает уже подключенный
      socket.removeAllListeners();
      ioSocket.onLine = true;
      console.log("IO connect", socket.id); // x8WIv7-mJelg7on_ALbx
      socket.on("connect", () => {
        // Восстановление подключения, после обрыва
        ioSocket.onLine = true;
      });
      socket.on("disconnect", () => {
        ioSocket.onLine = false; // undefined
      });
      socket.on("HELL", (val) => {
        ioSocket.timeServer = val.date;
        ioSocket.versionSite = process.env.versionSite;
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

    socket.on("message", (mess) => {
      console.log("IO message", mess); // undefined
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
    function notifSite() {
      notify({
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
  },
});
// function soundClick() {
//   let audio = new Audio(); // Создаём новый элемент Audio
//   audio.src = "/sound/kapli.mp3"; // Указываем путь к звуку "клика"
//   audio.autoplay = true; // Автоматически запускаем
// }
</script>
