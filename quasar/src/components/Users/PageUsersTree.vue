<template>
  <q-page :style-fn="panelFnHeight" class="flex flex-center scroll">
    <Users-Panel></Users-Panel>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeMount } from "vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import { useQuasar } from "quasar";
import UsersPanel from "./UsersPanel.vue";
export default defineComponent({
  name: "PageUserTree",
  components: { UsersPanel },
  setup() {
    const pageSetup = usePagesSetupStore();
    const $q = useQuasar();
    onBeforeMount(() => {
      // необходимо  указать до создания детей, здесь
      // именно это название используется для настроек, и сохранения размеров
      pageSetup.currentPage = "usersTree";
    });

    const { cardMain } = storeToRefs(usePagesSetupStore()); // необходимо для CSS,
    function panelFnHeight(offset, height) {
      pageSetup.pageOffset = offset;
      pageSetup.pageHeight = height;
      if ($q.platform.is.mobile) pageSetup.pagePaddingY = 10;
      else pageSetup.pagePaddingY = 60;
      console.log("pageSetup.arkCardHeight", pageSetup.arkCardHeight);
      let height2 = `calc(100vh - ${offset}px)`;
      cardMain.value.width.max = $q.screen.width - 20;
      // возвращаем рабочий размер окна, прокрутка?
      return {
        minHeight: height2,
        //height: height2,
        maxHeight: height2,
        minWidth: "100px",
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
  /* все кто внизу будут знать размер тела */
  max-height: v-bind("pageSetup.arkCardHeight+'px'");
  height: v-bind("pageSetup.arkCardHeight+'px'");
  min-height: 50px;
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
