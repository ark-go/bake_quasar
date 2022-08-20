<template>
  <!-- <div class="flex flex-center"> Привет.?? </div> -->
  <div class="menu-grid">
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
    <q-img
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
    </q-img>
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
        Прайс Прайс
      </div>
    </q-img>
  </div>
</template>

<script>
import { useUserStore } from "src/stores/userStore";
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "PageIndex",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    return { router, userStore };
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
