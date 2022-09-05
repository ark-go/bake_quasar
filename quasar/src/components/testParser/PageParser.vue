<template>
  <q-page
    :style-fn="panelFnHeight"
    class="flex flex-center"
    style="min-width: 360px"
  >
    <q-list :style="pageMaxHeight" style="max-width: 600px; min-width: 600px">
      <q-item class="column">
        <q-item-section class="row no-wrap">
          <q-input v-model="inputModel" label="Сюда"></q-input>
          <q-btn @click="onClick">Клик</q-btn>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="display: block">
          <q-table
            :rows="rows"
            style="max-height: 50vh"
            :pagination="pagination"
          >
          </q-table>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
import { useQuasar } from "quasar";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import { useTableFunc } from "./tableFunc";
export default defineComponent({
  name: "PageSale",
  components: {},
  setup() {
    const $q = useQuasar();
    const useTable = useTableFunc();
    const pageSetup = usePagesSetupStore();
    const rows = ref([]);
    const inputModel = ref(
      "https://www.sima-land.ru/instrumenty-dlya-dekorirovaniya/?c_id=47326&mode=infinite&per-page=20&sort=price&viewtype=list"
    );
    pageSetup.currentPage = "Parser";
    const { cardMain } = storeToRefs(usePagesSetupStore());
    // const {fontSize} = toRefs(state)
    const pageMaxHeight = ref();

    function panelFnHeight(offset, height2) {
      if (!$q.fullscreen.isActive) {
        //  console.log("Обычный Экран!");
        let marg = $q.platform.is.mobile ? 16 : 60; // Отступы окна
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
    async function onClick() {
      let g = await useTable.sendToParser(inputModel.value);
      console.log("PARSER ", g);
      rows.value = g;
    }
    function clickHelp() {}
    return {
      panelFnHeight,
      pageMaxHeight,
      cardMain,
      clickHelp,
      inputModel,
      onClick,
      rows,
      pagination: ref({
        rowsPerPage: 50,
      }),
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
