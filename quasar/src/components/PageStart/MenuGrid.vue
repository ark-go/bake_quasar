<template>
  <!-- <div class="flex flex-center"> Привет.?? </div> -->
  <div class="column q-py-sm" style="align-items: center">
    <div
      class="menu-grid"
      v-if="userStore.userInfo.email == 'Arkadii@yandex3.ru'"
    >
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        :img-style="{ cursor: 'pointer' }"
        img-class="img-menu cursor-pointer "
        @click="router.push({ path: '/bakery' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Пекарни
        </div>
      </q-img>
      <q-img
        v-ripple="{ color: 'yellow' }"
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu inset-shadow-5 cursor-pointer relative-position"
        @click="router.push({ path: '/kagent' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Контрагенты
        </div>
      </q-img>
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/products' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Продукция
        </div>
      </q-img>
      <!-- <q-img
      src="/images/1.jpg"
      loading="lazy"
      spinner-color="white"
      img-class="img-menu cursor-pointer"
      :img-style="{ cursor: 'pointer' }"
      @click="router.push({ path: '/docprice' })"
    >
      <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
        Цены
      </div>
    </q-img> -->
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/spravochnik' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Справочники
        </div>
      </q-img>
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/sale' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Продажи
        </div>
      </q-img>
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/departments' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Пользователи (управляющие)
        </div>
      </q-img>
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/price' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Документы Прайс
        </div>
      </q-img>
      <q-img
        src="/images/1.jpg"
        loading="lazy"
        spinner-color="white"
        img-class="img-menu cursor-pointer"
        :img-style="{ cursor: 'pointer' }"
        @click="router.push({ path: '/charts/1' })"
      >
        <div class="absolute-bottom text-subtitle1 text-center cursor-pointer">
          Тест
        </div>
      </q-img>
    </div>

    <draggable
      v-if="userStore.userInfo.email == 'Arkadii@yandex.ru'"
      tag="transition-group"
      item-key="id"
      class="flex row col-2 justify-center drag-menu"
      :list="listMenu"
      @change="log"
    >
      <Menu-Card
        class="text-center"
        v-for="element in listMenu"
        :key="element.id"
        :title="element.title"
        :link="element.link"
      >
      </Menu-Card>
    </draggable>
  </div>
</template>
<style lang="scss" scoped>
.drag-menu {
  width: 100%;
  max-width: 750px;
  @media (max-width: 600px) {
    width: 100%;
    max-width: 98vw;
  }
}
</style>
<script>
import { useUserStore } from "src/stores/userStore";
import { useStartPageStore, storeToRefs } from "src/stores/startPageStore";
import { defineComponent, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { VueDraggableNext } from "vue-draggable-next";
import MenuCard from "./MenuCard.vue";
export default defineComponent({
  name: "PageIndex",
  components: {
    draggable: VueDraggableNext,
    MenuCard,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const startPage = useStartPageStore();
    const { listMenu } = storeToRefs(useStartPageStore());
    // const listMenu = computed({
    //   get: () => {
    //     return startPage.listMenu;
    //   },
    //   set: async (val) => {
    //     await startPage.setListMenu(val);
    //   },
    // });
    // const listMenu = ref([
    //   { name: "Пекарни", id: 1, path: "/bakery" },
    //   { name: "Контрагенты", id: 2, path: "/kagent" },
    //   { name: "Продукция", id: 3, path: "/products" },
    //   { name: "Справочники", id: 4, path: "/spravochnik" },
    //   { name: "Продажи", id: 4, path: "/sale" },
    //   { name: "Пользователи (управляющие)", id: 4, path: "/departments" },
    //   { name: "Документы Прайс", id: 4, path: "/price" },
    //   { name: "Chart", id: 4, path: "/charts/3" },
    // ]);
    return { router, userStore, listMenu };
  },
});
</script>
<style lang="scss" scoped>
.menu-grid {
  background-color: transparent;
  display: grid;
  padding: 6px;
  gap: 15px;
  width: 700px;
  grid-template-columns: 1fr 1fr;
  //grid-template-rows: 150px 150px;
  //grid-auto-rows: 150px;
  grid-auto-rows: 50px;
  @media (max-width: 600px) {
    gap: 5px;
    grid-template-columns: 90vw;
    justify-content: center;
    // grid-template-rows: 80px 80px;
    //grid-auto-rows: 80px;
    padding: 2px;
    grid-auto-rows: 40px;
    min-width: 85vw;
  }
}
</style>
<style lang="scss">
.img-menu {
  font-size: 20px;
  //width: 150px;
  //max-width: 150px;
  //height: 150px;
  //max-height: 150px;
  cursor: pointer;
}
</style>
