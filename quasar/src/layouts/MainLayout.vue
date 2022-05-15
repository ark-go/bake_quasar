<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Хлеб и Тандыр </q-toolbar-title>

        <div>{{ username ? username : "v" + $q.version }},{{ user.email }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay bordered>
      <q-list>
        <q-item-label header> Выберите раздел </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
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
        <q-toolbar-title>
          {{ vidTable.specDocStore }} | {{ vidTable.store }} || {{ testName }}
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
import { useState } from "src/utils/useState.js";
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { emitter } from "boot/axios";
import FormLogin from "components/FormLogin.vue";
import pdfDialog from "components/pdfDialog/pdfDialog.vue";
import { arkVuex } from "src/utils/arkVuex"; // const { pdfWindow } = createArkVuex();
import { dataLoad } from "src/utils/ark.js";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { useTest } from "stores/test.js";
import { useUser } from "stores/storeUser.js";
import { storeToRefs } from "pinia";
//
export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    FormLogin,
    pdfDialog,
  },

  setup() {
    //const store = useTest();
    const { testName } = storeToRefs(useTest());
    const { info: user } = storeToRefs(useUser());

    const { vidTable } = useState();
    const { pdfWindow } = arkVuex();
    // const command = ref(pdfWindow.command);
    const pdfModal = ref(pdfWindow.show);
    // watchEffect(() => {
    //   pdfModal.value = command.value.show;
    // });
    //  const state = vidTable.specDocStore;
    console.log("Staate", vidTable.specDocStore);
    const leftDrawerOpen = ref(false);
    const username = ref("");
    const modalLoginOpen = ref(false);
    const emittMitt = () => {
      emitter.on("on-login", (mess) => {
        if (mess == "NoLogin") {
          modalLoginOpen.value = true;
          username.value = "Не авторизован";
        } else {
          username.value = mess;
        }
      });
      emitter.on("close-login", () => {
        modalLoginOpen.value = false;
      });
    };
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
      user, //
      testName, //
      pdfModal,
      vidTable,
      modalLoginOpen,
      username,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
const linksList = [
  {
    title: "Вход",
    caption: "Вход на сайт",
    icon: "school",
    link: "/login",
  },
  {
    title: "Справочник",
    caption: "Технические справочники",
    icon: "code",
    link: "/spravochnik",
  },
  {
    title: "Контрагенты",
    caption: "Партнеры",
    icon: "code",
    link: "/kagent",
  },
  {
    title: "Пекарни",
    caption: "Все пекарни",
    icon: "home_work",
    link: "/bakery",
  },
  {
    title: "Продукция",
    caption: "Номенклатура продукции",
    icon: "home_work",
    link: "/products",
  },
  {
    title: "Цены",
    caption: "Докумены для изменения цен",
    icon: "attach_money",
    link: "/docprice",
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
  },
  {
    title: "Пользователи",
    caption: "что-то про таблицы",
    icon: "code",
    link: "/tables/users",
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
  },
  {
    title: "Загрузка XLS",
    caption: "Тест",
    icon: "close",
    link: "/xls",
  },
  {
    title: "Получим PDF",
    caption: "pdf",
    icon: "close",
    link: "api/pdf",
  },
];
</script>
