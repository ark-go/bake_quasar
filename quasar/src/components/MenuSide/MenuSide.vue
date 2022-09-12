<template>
  <q-list>
    <q-item clickable @click="router.push({ path: '/' })">
      <q-item-section avatar>
        <q-icon name="home" />
      </q-item-section>

      <q-item-section>
        <q-item-label>HOME</q-item-label>
        <q-item-label caption> "На начальную страницу" </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <!-- <q-item-label header> </q-item-label> -->
    <Menu-Side-Items
      v-for="link in listMenuSide"
      :key="link.title"
      v-bind="link"
    />
  </q-list>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import MenuSideItems from "./MenuSideItems.vue";
import { useStartPageStore, storeToRefs } from "src/stores/startPageStore";
export default defineComponent({
  name: "MenuSide",
  components: { MenuSideItems },
  props: {},
  setup() {
    //>tag="a" :href="link">
    const router = useRouter();
    const { listMenuSide } = storeToRefs(useStartPageStore());
    function onClick(lnk) {
      if (lnk == "api/pdf") {
        window.open(lnk, "_blank");
      } else {
        router.push({ path: lnk });
      }
    }
    return {
      onClick,
      listMenuSide,
      router,
    };
  },
});
</script>
