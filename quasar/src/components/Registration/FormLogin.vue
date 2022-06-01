<template>
  <div
    class="column shadow-7 rounded-borders"
    style="width: 250px; padding: 6px"
  >
    <q-input
      color="indigo"
      v-model="login"
      label="Логин"
      type="email"
      autocomplete="on"
    >
      <template v-slot:prepend>
        <q-icon name="event" />
      </template>
    </q-input>
    <q-input
      color="indigo"
      v-model="password"
      label="Пароль"
      type="password"
      autocomplete="on"
    >
      <template v-slot:prepend>
        <q-icon name="event" />
      </template>
    </q-input>
    <q-input color="indigo" v-model="FA2token" label="2FA токен:">
      <template v-slot:prepend>
        <q-icon name="event" />
      </template>
    </q-input>
    <br />
    <q-btn outline rounded color="indigo" label="Дальше" @click="sendLogin" />
    <span style="text-align: right; color: #3f3b3b">
      <span>регистрация </span>
      <span @click="onReg" class="cursor-pointer">здесь</span>
    </span>
  </div>
</template>
<script>
import { ref, nextTick } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useMainStore } from "stores/mainStore.js";
import { useUserStore } from "stores/userStore.js";
//import { storeToRefs } from "pinia";
export default {
  name: "FormLogin",
  setup() {
    const user = useUserStore(); //
    const router = useRouter();
    //   const route = useRoute();
    const mainStore = useMainStore();
    const { notify } = useQuasar();
    const login = ref("");
    const password = ref("");
    const FA2token = ref("");
    function onReg() {
      mainStore.modalLoginOpen = false;
      nextTick(() => {
        router.push({ name: "registration" });
      });
    }
    async function sendLogin() {
      try {
        let resp = await axios.post("/api/login", {
          login: login.value.trim(),
          password: password.value.trim(),
          FA2token: FA2token.value.trim(),
        });
        // console.log(resp);
        let loginResult = resp.data;
        if (loginResult.error) {
          console.log("Ошибка:", loginResult.error);
          notify({
            color: "negative",
            position: "top",
            message: loginResult.error,
            icon: "report_problem",
          });
        } else {
          notify({
            color: "green",
            position: "top",
            message: "Вход",
            icon: "report_problem",
          });
          if (loginResult?.email) {
            user.userInfo = loginResult;
            mainStore.modalLoginOpen = false;
          }

          router.go(); //! перезагрузка окна
          //window.location.reload();
          //router.push({ path: "/" });
        }
      } catch (err) {
        if (err?.response?.status == 429) {
          notify({
            color: "negative",
            position: "top",
            message: "Не нажимайте часто кнопку.",
            icon: "report_problem",
          });
        } else {
          notify({
            color: "negative",
            position: "top",
            message: "Ошибка передачи данных.",
            icon: "report_problem",
          });
        }
      }
    }
    return {
      onReg,
      login,
      password,
      FA2token,
      sendLogin,
    };
  },
};
</script>
