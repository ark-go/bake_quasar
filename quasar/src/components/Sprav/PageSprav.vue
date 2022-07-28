<template>
  <q-page
    :style-fn="panelFnHeight"
    class="flex flex-center"
    style="min-width: 360px"
  >
    <sprav :pageMaxHeight="pageMaxHeight"></sprav>
  </q-page>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
import Sprav from "components/Sprav/Sprav.vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
export default defineComponent({
  name: "PageSprav",
  components: {
    Sprav,
  },
  setup() {
    const pageSetup = usePagesSetupStore();
    pageSetup.currentPage = "sprav";
    const { cardMain } = storeToRefs(usePagesSetupStore());
    // const {fontSize} = toRefs(state)
    const pageMaxHeight = ref();
    function panelFnHeight(offset, height2) {
      let height = `calc(100vh - ${offset}px)`;
      let heightChild = `calc(100vh - ${offset}px - 60px)`;
      pageMaxHeight.value = { minHeight: heightChild, maxHeight: heightChild };
      return { minHeight: height, maxHeight: height };
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
