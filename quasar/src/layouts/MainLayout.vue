<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Хлеб и Тандыр {{ ioSocket.versionSite }}</q-toolbar-title
        >

        <div>{{ userInfo.username || userInfo.email }}</div>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer side="left" v-model="leftDrawerOpen" overlay bordered>
      <q-list>
        <q-item-label header> Выберите раздел </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      overlay
      bordered
      behavior="mobile"
      elevated
    >
      <right-items></right-items>
    </q-drawer>
    <q-page-container>
      <!-- <router-view /> -->
      <router-view v-slot="{ Component }">
        <transition name="mode-fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <q-footer ref="footer" id="footer">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :color="ioSocket.onLine ? 'green' : 'red'"
          icon="star_rate"
          @click="getAllUsers"
        />
        <q-toolbar-title>
          <span style="font-size: 14px; color: rgb(104, 104, 235)">{{
            ioSocket.timeServer
          }}</span>
          <q-avatar> </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
  <!-- @click.self="modalLoginOpen = modalLoginOpen" -->
  <teleport to="body">
    <div
      v-if="modalLoginOpen"
      class="modal1 flex flex-center ark-popup shadow-6"
    >
      <form-login class="ark-popup-body"></form-login>
    </div>
  </teleport>
  <teleport to="body" v-if="pdfModal">
    <pdf-dialog></pdf-dialog>
  </teleport>
</template>
<style lang="scss" scoped>
#footer {
  // background-color: rgb(161, 158, 158);
  background-color: rgb(233, 229, 229);
}
.modal1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  z-index: 3500;
}

.ark-popup-body {
  background-color: white;
}
.ark-popup {
  background-color: rgba(123, 123, 124, 0.5);
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}
</style>
<script>
import EssentialLink from "components/EssentialLink.vue";
import RightItems from "components/mainPage/rightDrawer/rightItems.vue";
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { emitter } from "boot/axios";
import FormLogin from "components/FormLogin.vue";
import pdfDialog from "components/pdfDialog/pdfDialog.vue";
import { arkVuex } from "src/utils/arkVuex"; // const { pdfWindow } = createArkVuex();
import { dataLoad } from "src/utils/ark.js";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
//import { useTest } from "stores/test.js";
import { useUserStore } from "stores/userStore.js";
import { useMainStore } from "stores/mainStore.js";
import { storeToRefs } from "pinia";
import { useIoSocket } from "stores/ioSocket.js";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    FormLogin,
    pdfDialog,
    RightItems,
  },

  setup() {
    //const store = useTest();

    const { rightDrawerOpen, leftDrawerOpen, modalLoginOpen } = storeToRefs(
      useMainStore()
    );
    const { notify } = useQuasar();
    const ioSocket = useIoSocket();
    const { userInfo } = storeToRefs(useUserStore());
    const { pdfWindow } = arkVuex();
    // const command = ref(pdfWindow.command);
    const pdfModal = ref(pdfWindow.show);
    const essentialLinks = ref([]);
    const username = ref("");
    //const modalLoginOpen = ref(false);
    const emittMitt = () => {
      emitter.on("on-login", (mess) => {
        if (mess == "NoLogin") {
          modalLoginOpen.value = true;
        }
      });
      // emitter.on("close-login", () => {
      //   modalLoginOpen.value = false;
      // });
    };
    onMounted(() => {
      console.log("User rol", userInfo.value.roles);
      essentialLinks.value = linkList(
        userInfo.value.roles,
        userInfo.value.email
      );
    });
    onMounted(emittMitt);
    //! Здесь будем проверять доступ
    onBeforeRouteLeave(async (to, from) => {
      console.log("Переход то", to);
      let check = await dataLoad("/api/accessCheck", { path: to.path }, "");
      if (check.error) {
        return false;
      }
      // https://router.vuejs.org/guide/advanced/composition-api.html#navigation-guards
      // const answer = window.confirm("Переходим ?");
      // // cancel the navigation and stay on the same page
      // if (!answer) return false;
    });
    onBeforeRouteUpdate(async (to, from) => {
      console.log("Упдате то", to);
    });
    return {
      rightDrawerOpen,
      leftDrawerOpen,
      ioSocket,
      userInfo, //
      pdfModal,
      modalLoginOpen,
      username,
      essentialLinks,
      getAllUsers() {
        ioSocket.socket
          .timeout(5000)
          .emit("getAllUsers", "Хочу всех пользователей", (err, val) => {
            if (err) {
              console.log("IO emit timeout err", err);
              notify({
                color: "red-6",
                textColor: "white",
                icon: "bolt",
                message: "Нет ответа",
                //caption: "Перегрузить окно",
                position: "center",
                // avatar,
                multiLine: true,
                timeout: 0,
                closeBtn: "Ok",
                html: true,
              });
              // другая сторона не подтвердила событие в данную задержку
            } else {
              notify({
                color: "brown",
                classes: "glossy",
                textColor: "white",
                icon: "bolt",
                message: "Пользователи OnLine",
                caption: val.allUsers,
                position: "center",
                // avatar,
                multiLine: true,
                timeout: 0,
                closeBtn: "Ok",
                html: true,
              });
            }
          });
        // ioSocket.socket.emit("getAllUsers");
      },
    };
  },
});
function linkList(roles = [], email) {
  return [
    {
      title: "Вход",
      caption: "Вход на сайт",
      icon: "school",
      link: "/login",
      visible: !email,
    },
    {
      title: "Справочник",
      caption: "Технические справочники",
      icon: "code",
      link: "/spravochnik",
      visible: roles.includes("USER"),
    },
    {
      title: "Контрагенты",
      caption: "Партнеры",
      icon: "code",
      link: "/kagent",
      visible: roles.includes("USER"),
    },
    {
      title: "Пекарни",
      caption: "Все пекарни",
      icon: "home_work",
      link: "/bakery",
      visible: roles.includes("USER"),
    },
    {
      title: "Продукция",
      caption: "Номенклатура продукции",
      icon: "home_work",
      link: "/products",
      visible: roles.includes("USER"),
    },
    {
      title: "Цены",
      caption: "Докумены для изменения цен",
      icon: "attach_money",
      link: "/docprice",
      visible: roles.includes("USER"),
    },
    // {
    //   title: "Номенклатура",
    //   caption: "номенклатура ввод",
    //   icon: "dynamic_form",
    //   link: "/nomencl",
    // },
    {
      title: "Спецификации магазина",
      caption: "Спецификации магазинов",
      icon: "code",
      link: "/specstore",
      visible: roles.includes("ADMIN"),
    },
    // {
    //   title: "Продажи",
    //   caption: "продажи, регистрация",
    //   icon: "dynamic_form",
    //   link: "/prodaja",
    // },
    {
      title: "Все",
      caption: " таблицы",
      icon: "dynamic_form",
      link: "/tables",
      visible: roles.includes("MODERATOR"),
    },
    {
      title: "Пользователи",
      caption: "что-то про таблицы",
      icon: "code",
      link: "/tables/users",
      visible: roles.includes("MODERATOR"),
    },
    // {
    //   title: "Пекарни",
    //   caption: "Список",
    //   icon: "code",
    //   link: "/tables/bakehouses",
    // },

    {
      title: "Фото",
      caption: "Тест фотографии",
      icon: "close",
      link: "/photo",
      visible: roles.includes("ADMIN"),
    },
    {
      title: "Загрузка XLS",
      caption: "Тест",
      icon: "close",
      link: "/xls",
      visible: roles.includes("ADMIN"),
    },
    {
      title: "Получим PDF",
      caption: "pdf",
      icon: "close",
      link: "api/pdf",
      visible: roles.includes("ADMIN"),
    },
  ];
}
</script>
