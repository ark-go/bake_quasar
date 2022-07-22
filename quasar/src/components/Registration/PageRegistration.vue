<template>
  <q-page
    class="flex flex-center"
    style="min-width: 360px"
    :style-fn="panelFnHeight"
  >
    <Form-Registration
      :pageMaxHeight="pageMaxHeight"
      :heightRabZone="heightRabZone"
      title="Регистрация"
      @on-Code-Registration="onCodeRegistration"
      subTitle="Введите необходимые данные"
    ></Form-Registration>
  </q-page>
</template>

<script>
import { useMeta, Notify } from "quasar";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { useMainStore } from "stores/mainStore.js";
import { useRouter } from "vue-router";
import { axios } from "boot/axios";
import FormRegistration from "./FormRegistration.vue";
export default defineComponent({
  name: "PageRegistration",
  components: { FormRegistration },
  setup(props) {
    const router = useRouter();
    useMeta({ title: "Регистрация" });
    const mainStore = useMainStore();
    onMounted(async () => {
      mainStore.modalLoginOpen = false; // закроем форму логин, если открыта
      if (
        router.currentRoute.value.params.id &&
        router.currentRoute.value.params.code
      ) {
        console.log("Пришли коды");
        await sendCommand("/api/reguser", {
          id: router.currentRoute.value.params.id,
          code: router.currentRoute.value.params.code,
        });
        //! -------------------------------------------------------------------------------------
        router.push({ path: "/" });
      }
    });
    async function onCodeRegistration(id, code) {
      await sendCommand("/api/reguser", {
        id: id,
        code: code,
      });
    }
    const heightRabZone = ref(0);
    const pageMaxHeight = ref();
    function panelFnHeight(offset, height2) {
      heightRabZone.value = height2 - offset - 60;
      let height = `calc(100vh - ${offset}px)`;
      let heightChild = `calc(100vh - ${offset}px - 60px)`;
      pageMaxHeight.value = { minHeight: heightChild, maxHeight: heightChild };
      return { minHeight: height, maxHeight: height };
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
      if (respData.result) {
        console.log(">>>>", respData.result);
        //? Все хорошо.
        Notify.create({
          classes: "notify-error-top",
          color: "green",
          position: "top",
          message: respData.result,
          icon: "report_problem",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
        return respData.result;
      }
    }
    return { panelFnHeight, onCodeRegistration };
  },
});
</script>
