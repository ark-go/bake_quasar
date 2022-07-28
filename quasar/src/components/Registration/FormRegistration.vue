<template>
  <ark-card
    class="ark-scroll"
    :title="title"
    :subTitle="subTitle"
    style="max-width: 500px; min-width: 300px"
    :pageMaxHeight="pageMaxHeight"
    :heightRabZone="heightRabZone"
    :buttonArr="false"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
    <q-input
      dense
      name="email"
      label="E-mail"
      placeholder="Введите свою почту"
      type="email"
      :rules="[(val) => val.match(regexpEmail) || 'Введите правильный E-mail']"
      hide-hint
      hide-bottom-space
      no-error-icon
      v-model="dataUser.email"
    />
    <q-input
      dense
      label="Фамилия"
      type="text"
      placeholder="Введите свою фамилию"
      v-model="dataUser.fam"
    />

    <q-input
      dense
      label="Имя"
      type="text"
      placeholder="Введите свое имя"
      v-model="dataUser.name"
    />

    <q-input
      autocomplete="off"
      dense
      label="Отчество"
      type="text"
      placeholder="Введите своё отчество"
      v-model="dataUser.otch"
    />
    <q-input
      dense
      label="Комментарий к регистрации"
      type="textarea"
      autogrow=""
      placeholder="Опишите причину для регистрации"
      v-model="dataUser.prim"
    />
    <q-field dense color="grey-3" label-color="orange" stack-label>
      <template v-slot:append>
        <q-icon
          name="help_outline"
          @click="helpPass"
          color="orange"
          class="cursor-pointer"
        />
      </template>
      <template v-slot:control>
        <div class="self-center full-width no-outline" tabindex="0">
          Запишите пароль
        </div>
      </template>
    </q-field>

    <div class="row" style="justify-content: space-between">
      <q-btn to="/" label="Отмена" color="primary" flat />
      <q-btn
        v-if="dataUser.email.match(regexpEmail) && dataUser.password"
        @click="onRegister"
        label="Готово"
        color="primary"
        flat
      />
    </div>
  </ark-card>
  <q-dialog v-model="helpPassDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Сохраните пароль</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          Пароль нигде не запоминается и не высылается по почте<br />
          Ваш пароль:<br />
          <div style="text-align: center; font-size: 20px">
            {{ dataUser.password }}
          </div>
          после входа на сайт вы сможете поменять его.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="qrCodeDialog"
    @beforeShow="beforeShowCodeDialog"
    @hide="hideShowCodeDialog"
    persistent=""
  >
    <q-card style="max-width: 300px">
      <q-card-section>
        <div class="text-bold">Подтвердите регистрацию</div>
      </q-card-section>
      <q-card-section align="center" style="max-width: 300px; padding-top: 0px">
        <div class="text-grey-9">
          Не закрывайте окно до завершения регистрации,<br />
          осталось времени:
          <b>{{ timerStr }}</b>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none text-center" style="padding-bottom: 2px">
        <q-img
          :src="QRCodeImage"
          spinner-color="white"
          style="height: 220px; max-width: 220px"
        />
      </q-card-section>
      <q-card-section style="padding-top: 0px; padding-bottom: 0px">
        <q-input
          dense
          name="text"
          label="Проверка пароля"
          type="password"
          placeholder="Повторите пароль"
          v-model="rePassword"
        />
        <q-input
          autocomplete="off"
          dense
          label="Код:"
          type="text"
          placeholder="Введите код из устройства"
          v-model="QRCode"
          autofocus
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Закрыть"
          color="primary"
          @click="qrCodeDialog = false"
        />
        <q-btn flat label="OK" color="primary" @click="onRegisterQRCode" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="messSendEmailDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Вам отправлено письмо</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div>
          Вам выслано письмо для подтверждения, пожалуйста проверте почтовый
          ящик, и папку спам<br />
          вы можете закрыть эту вкладку браузера, и подтвердить e-mail из
          письма,<br />
          или ввести код полученный в письме в поле ниже.
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none row justify-center">
        <q-input
          dense
          label="Код"
          type="text"
          placeholder="Вставьте код из письма"
          v-model="codeRegistration"
        />
        <q-btn
          class=""
          dense
          flat
          label="Ввод"
          color="primary"
          @click="onCodeRegist(codeRegistration)"
          v-close-popup
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Закрыть" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, unref, onMounted, nextTick } from "vue";
import generatePassword from "password-generator";
import ArkCard from "./ArkCard.vue";
import { axios } from "boot/axios";
import { Notify } from "quasar";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "FormRegistration",
  components: {
    ArkCard,
  },
  emits: ["onCodeRegistration"],
  props: {
    pageMaxHeight: String,
    heightRabZone: String,
    title: String,
    subTitle: String,
  },
  setup(props, { emit }) {
    const dataUser = ref({
      email: "",
      password: "",
      fam: "",
      name: "",
      otch: "",
      prim: "",
    });
    const QRCode = ref("");
    const timer = ref();
    const timerDelay = ref(10);
    const timerStr = ref("");
    const QRCodeImage = ref("");
    const helpPassDialog = ref(false);
    const qrCodeDialog = ref(false);
    const rePassword = ref("");
    const messSendEmailDialog = ref(false);
    const codeRegistration = ref("");
    const savedId = ref(0); // id юзера которому послали почту
    const regexpEmail = ref(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i);
    const regexpPass = ref(
      /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
    );
    // const regexpEmail = ref(
    //   new RegExp(
    //     "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])"
    //   )
    // );
    function helpPass() {
      console.log(passGen());
      dataUser.value.password = passGen();
      nextTick(() => {
        helpPassDialog.value = true;
      });
    }
    //  const $q = useQuasar();
    const $router = useRouter();
    function passGen() {
      let maxLength = 10;
      let minLength = 8;
      let uppercaseMinCount = 2;
      let lowercaseMinCount = 3;
      let numberMinCount = 2;
      let specialMinCount = 1;
      let UPPERCASE_RE = /([A-Z])/g;
      let LOWERCASE_RE = /([a-z])/g;
      let NUMBER_RE = /([\d])/g;
      let SPECIAL_CHAR_RE = /([\?\$@#%&*])/g;
      let NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

      function isStrongEnough(password) {
        let uc = password.match(UPPERCASE_RE);
        let lc = password.match(LOWERCASE_RE);
        let n = password.match(NUMBER_RE);
        let sc = password.match(SPECIAL_CHAR_RE);
        let nr = password.match(NON_REPEATING_CHAR_RE);
        return (
          password.length >= minLength &&
          !nr &&
          uc &&
          uc.length >= uppercaseMinCount &&
          lc &&
          lc.length >= lowercaseMinCount &&
          n &&
          n.length >= numberMinCount &&
          sc &&
          sc.length >= specialMinCount
        );
      }

      function customPassword() {
        // console.log("kod", isStrongEnough());
        let password = "";
        let randomLength =
          Math.floor(Math.random() * (maxLength - minLength)) + minLength;
        while (!isStrongEnough(password)) {
          password = generatePassword(randomLength, false, /[\w\d\?\$@#%&*]/);
        }
        return password;
      }
      return customPassword();
    }
    async function onRegister() {
      // пока не знаю, но мне нужно обновить сессию,
      // let r = await sendCommand("/api/reguser", dataUser.value);
      // nextTick(async () => {
      const r = await sendCommand("/api/reguser", dataUser.value);
      if (r) {
        console.log(r);
        QRCodeImage.value = r.QRCodeUrl;
        timerDelay.value = r.timerDelay;
        qrCodeDialog.value = true;
      }
      //  });
    }
    async function onRegisterQRCode() {
      if (!QRCode.value || !rePassword.value) {
        Notify.create({
          classes: "notify-error-top",
          color: "red",
          position: "top",
          message: "Введите все данные.",
          icon: "report_problem",
        });
        return;
      }
      // при успехе пошлется письмо, при ошибке вернет Null либо ре
      const r = await sendCommand("/api/reguser", {
        qrCode: QRCode.value,
        rePassword: rePassword.value,
      });
      QRCode.value = ""; // очищаем, раз отправили

      if (r) {
        console.log(">>22", r);
        savedId.value = r;
        qrCodeDialog.value = false;
        messSendEmailDialog.value = true;
        // все прошло
      }
    }
    async function sendCommand(url, data) {
      let resp = await axios.post(url, data);
      let respData = resp.data;
      let keyRes = Object.keys(respData);
      if (!keyRes.includes("result") && !keyRes.includes("error")) {
        // может считать страницу 404 и код 200
        console.log("При загрузке нет данных");
        Notify.create({
          classes: "notify-error-top",
          color: "red",
          position: "top",
          message: "Нет ответа",
          icon: "report_problem",
        });
        return null;
        //throw " Не полученно данных.";
      }
      if (respData.error) {
        console.log(respData);
        Notify.create({
          classes: "notify-error-top",
          color: "red",
          position: "top",
          message: respData.error,
          icon: "report_problem",
        });

        return null;
      }
      return respData.result;
    }
    function startTimer() {
      let sec = timerDelay.value;
      if (timer.value) clearInterval(timer.value);
      timer.value = setInterval(updateClock, 1000);
      function updateClock() {
        sec -= 1;
        let hours = Math.floor(sec / 60 / 60);

        // 37
        let minutes = Math.floor(sec / 60) - hours * 60;

        // 42
        let seconds = sec % 60;
        let formatted = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":");
        //console.log(formatted);
        timerStr.value = formatted;
        if (sec <= 0) {
          if (timer.value) clearInterval(timer.value);
          qrCodeDialog.value = false;
        }
      }
    }
    return {
      emit,
      timer,
      timerStr,
      helpPass,
      dataUser,
      regexpEmail,
      regexpPass,
      helpPassDialog,
      qrCodeDialog,
      messSendEmailDialog,
      codeRegistration,
      QRCode,
      QRCodeImage,
      rePassword,
      savedId,
      onRegisterQRCode,
      passGen,
      onRegister,
      beforeShowCodeDialog() {
        QRCode.value = "";
        startTimer();
      },
      hideShowCodeDialog() {
        if (timer.value) clearInterval(timer.value);
      },
      onCodeRegist(code) {
        emit("onCodeRegistration", savedId.value, code);
      },
    };
  },
});
</script>
