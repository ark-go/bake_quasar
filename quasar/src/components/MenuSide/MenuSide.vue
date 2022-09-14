<template>
  <q-list>
    <q-item clickable @click="router.push({ path: '/' })">
      <q-item-section avatar>
        <q-icon name="home" color="blue-grey-4" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Главная</q-item-label>
        <q-item-label caption> "в начало" </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-checkbox
          v-model="pinCheckbox"
          label=""
          checked-icon="mdi-pin"
          unchecked-icon="mdi-pin-off"
          color="green"
          :keep-color="false"
        />
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
import { defineComponent, ref } from "vue";
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
      pinCheckbox: ref(false),
    };
  },
});
</script>
