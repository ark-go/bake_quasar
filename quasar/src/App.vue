<template>
  <div @keyup.esc.capture.stop.prevent="clickBody">
    <router-view />
  </div>
</template>
<script>
//import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { defineComponent, onMounted } from "vue";
//import { io } from "socket.io-client";
//import { useIoSocket } from "stores/ioSocket.js";
// import { soundPlay } from "src/utils/sound.js";
//import { useQuasar } from "quasar";
import { Cookies } from "quasar";
import { detect } from "detect-browser";
import { useUserStore } from "stores/userStore.js";

import { axios, emitter } from "boot/axios";
export default defineComponent({
  name: "App",
  setup() {
    let browser = detect();
    browser.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // добавим таймзону
    Cookies.set("browser", browser); // в отправку
    //const { notify } = useQuasar();
    const UserStore = useUserStore();
    dataLoad(UserStore); // проверка на логин
    onMounted(() => {
      emitter.on("HELL", (val) => {
        console.log("HELLO Socket IO", val);
      });
    });
    function clickBody(key) {
      console.log("body click стереть если не пригодилось", key);
    }
    async function dataLoad(UserStore) {
      try {
        let resp = await axios.post("/api/isLogin", {});
        let data = resp.data;
        console.log("user", data);
        UserStore.userInfo = data;
      } catch (err) {
        console.log(err);
        UserStore.userInfo = {};
      }
    }
    return { clickBody };
  },
});
// function soundClick() {
//   let audio = new Audio(); // Создаём новый элемент Audio
//   audio.src = "/sound/kapli.mp3"; // Указываем путь к звуку "клика"
//   audio.autoplay = true; // Автоматически запускаем
// }
</script>
