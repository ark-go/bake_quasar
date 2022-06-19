<template>
  <ark-card
    title="Cправочники"
    :pageMaxHeight="pageMaxHeight"
    :subTitle="spravStore.selectedNode.label"
    style="width: 700px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :selectedNode="selectedNode"
  >
    <template v-slot:before>
      <sprav-tree
        style="min-width: 100px"
        v-model:selectedNode="selectedNode"
      ></sprav-tree>
    </template>
    <template v-slot:after>
      <component
        v-if="selectedNode.tableName"
        :is="currentTable"
        v-bind="{ tableInfo: selectedNode }"
      ></component>
      <div v-else class="text-none-table">Выберите что-нибудь.</div>
    </template>
  </ark-card>
</template>

<script>
import { defineComponent, ref, watch, watchEffect, computed } from "vue";
import SpravTree from "components/Sprav/SpravTree.vue";
import SpravTable from "components/Sprav/SpravTable.vue";
import TradeMarkTable from "components/Trademark/TrademarkTable.vue";
import CityTable from "components/City/Table.vue";
import ArkCard from "./ArkCard.vue";
import NoTable from "components/Sprav/NoTable.vue";

import { useSpravStore } from "stores/spravStore";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageSprav",
  props: {
    pageMaxHeight: Object,
  },
  components: {
    ArkCard,
    SpravTree,
  },
  setup() {
    //  const $q = useQuasar();
    const spravStore = useSpravStore();
    const selectedNode = ref({});
    //  const selectedNode2 = ref({});
    const $router = useRouter();
    const currentTableName = ref(null);
    const currentTable = ref(SpravTable);
    const $q = useQuasar();
    const splitHorizont = ref(false);
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
    const splitStyleW = {
      background: "rgb(214 214 214)",
      minWidth: "50px",
      minHeight: "6px",
      borderRadius: "3px",
    };
    watchEffect(() => {
      splitHorizont.value = $q.screen.width < $q.screen.height;
    });
    watchEffect(() => {
      console.log(">", selectedNode.value?.tableType);
      spravStore.selectedNode = selectedNode.value;
      switch (selectedNode.value.tableType) {
        case undefined:
          currentTable.value = SpravTable;
          break;
        case "trademark":
          currentTable.value = TradeMarkTable;
          break;
        case "city":
          currentTable.value = CityTable;
          break;
        default:
          currentTable.value = undefined;
          break;
      }
      console.log(
        "Произошел выбор справочника таблиц:",
        currentTable.value?.name,
        selectedNode.value?.tableType
      );
    });
    const buttonArr = ref([
      { key: "backRoute", name: "Назад" },
      //  { key: "Добавить", name: "Второй" },
    ]);
    function buttonClick(val) {
      if (val == "backRoute") {
        console.log(val);
        $router.go(-1);
      }
    }
    return {
      spravStore,
      currentTable,
      selectedNode,
      // selectedNode2,
      currentTableName,
      splitterModel: ref(30),
      splitHorizont,
      splitStyleH,
      splitStyleW,
      buttonArr,
      buttonClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  padding: 6px;
  gap: 10px;
  grid-template-columns: 40% 1fr;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
  }
}
.text-none-table {
  text-align: center;
  font-weight: bold;
  color: #8b8787;
  font-size: 20px;
}
</style>
