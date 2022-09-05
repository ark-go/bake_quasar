<template>
  <q-page
    :style-fn="panelFnHeight"
    class="flex flex-center"
    style="min-width: 360px"
  >
    <Price :pageMaxHeight="pageMaxHeight"></Price>
  </q-page>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
import Price from "./Price.vue";
import { useQuasar } from "quasar";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
export default defineComponent({
  name: "PagePrice",
  components: {
    Price,
  },
  setup() {
    const $q = useQuasar();
    const pageSetup = usePagesSetupStore();
    pageSetup.currentPage = "price";
    const { cardMain } = storeToRefs(usePagesSetupStore());
    // const {fontSize} = toRefs(state)
    const pageMaxHeight = ref();

    function panelFnHeight(offset, height2) {
      if (!$q.fullscreen.isActive) {
        //  console.log("Обычный Экран!");
        let marg = $q.platform.is.mobile ? 16 : 60; // Отступы окна
        if ($q.platform.is.electron) {
          marg = 0;
        }
        let height = `calc(100vh - ${offset}px)`;
        let heightChild = `calc(100vh - ${offset}px - ${marg}px)`;
        pageMaxHeight.value = {
          minHeight: heightChild,
          maxHeight: heightChild,
        };
        return { minHeight: height, maxHeight: height };
      } else {
        console.log("Полный Экран!");
        pageMaxHeight.value = {
          minHeight: "100vh",
          maxHeight: "100vh",
        };
        return {};
      }
    }
    function clickHelp() {}
    return {
      panelFnHeight,
      pageMaxHeight,
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
</style>
