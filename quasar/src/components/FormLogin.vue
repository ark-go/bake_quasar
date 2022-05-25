<template>
  <div class="column" style="width: 250px; padding: 6px">
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
    <div v-show="QRCode" class="column flex flex-center">
      <div style="padding: 4px">
        Зарегистрируй Google Authenticator<br />и введи с него код
      </div>
      <q-img
        :src="QRCode"
        spinner-color="white"
        style="height: 200px; max-width: 200px"
      />
    </div>
    <q-input color="indigo" v-model="FA2token" label="2FA токен:">
      <template v-slot:prepend>
        <q-icon name="event" />
      </template>
    </q-input>
    <br />
    <q-btn outline rounded color="indigo" label="Дальше" @click="loginNext" />
  </div>
</template>
<script>
import { ref, nextTick } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useMainStore } from "stores/mainStore.js";
import { useUserStore } from "stores/userStore.js";
import { storeToRefs } from "pinia";
export default {
  name: "FormLogin",
  setup() {
    const user = useUserStore(); //
    const router = useRouter();
    const mainStore = useMainStore();
    const { notify } = useQuasar();
    const login = ref("");
    const password = ref("");
    const QRCode = ref("");
    const FA2token = ref("");

    async function loginNext() {
      let loginResult = await getQRcode(notify, login, password, FA2token);
      if (loginResult?.QRCodeUrl) {
        QRCode.value = loginResult.QRCodeUrl;
        console.log(loginResult);
      }
      // иныормацию об ошибке покажем в любом случае
      // даже если пришел QR код
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
    }

    return {
      login,
      password,
      loginNext,
      QRCode,
      FA2token,
    };
  },
};
async function getQRcode(notify, login, password, FA2token) {
  try {
    let resp = await axios.post("/api/login", {
      login: login.value.trim(),
      password: password.value.trim(),
      FA2token: FA2token.value.trim(),
    });
    let data = resp.data;
    return data;
  } catch (err) {
    //console.dir(err);
    console.log(err);
    if (err?.response?.status == 429) {
      return {
        error: "Не нажимайте часто кнопку.",
      };
    }
    return {
      error: "Login: Ошибка передачи данных",
    };
  }
}
</script>
