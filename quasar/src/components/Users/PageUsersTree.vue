<template>
  <q-page :style-fn="panelFnHeight" class="flex flex-center scroll">
    <Ark-Card></Ark-Card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import { useQuasar } from "quasar";
import ArkCard from "./ArkCard.vue";
export default defineComponent({
  name: "PageUserTree",
  components: { ArkCard },
  setup() {
    const pageSetup = usePagesSetupStore();
    const $q = useQuasar();
    // pageSetup.currentPage = "usersTree";

    onMounted(() => {
      pageSetup.currentPage = "usersTree";
    });

    const { cardMain } = storeToRefs(usePagesSetupStore()); // необходимо для CSS,
    function panelFnHeight(offset, height) {
      pageSetup.pageOffset = offset;
      pageSetup.pageHeight = height;
      pageSetup.pagePaddingY = 60;
      console.log("pageSetup.arkCardHeight", pageSetup.arkCardHeight);
      let height2 = `calc(100vh - ${offset}px)`;
      cardMain.value.width.max = $q.screen.width - 20;
      // возвращаем рабочий размер окна, прокрутка?
      return {
        minHeight: height2,
        //height: height2,
        maxHeight: height2,
        minWidth: "360px",
      };
    }
    function clickHelp() {}
    return {
      pageSetup,
      panelFnHeight,
      cardMain,
      clickHelp,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.q-table tbody td) {
  font-size: v-bind("cardMain.fontSize.curr + 'px'");
}
:deep(.q-tree) {
  font-size: v-bind("cardMain.fontSize.curr + 'px'");
}

:deep(.arkcard-size) {
  max-height: v-bind("pageSetup.arkCardHeight+'px'");
  height: v-bind("pageSetup.arkCardHeight+'px'");
  min-height: 200px;
  width: 100%;
  min-width: v-bind("cardMain.width.min+'px'");
  max-width: v-bind("cardMain.width.curr+'px'");
  transition-property: max-width, max-height;
  //  transition-timing-function: ease-in-out;
  transition-duration: 250ms;
  overflow: auto;
  @media (max-width: 600px) {
    min-width: 94vw;
    width: 94vw;
  }
}
</style>
