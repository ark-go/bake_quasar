<template>
  <ark-card
    title="Cправочники"
    subTitle=""
    style="width: 700px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
  >
    <div class="ark-grid">
      <div class="ark-grid-left">
        <sprav-tree
          style="min-width: 100px"
          v-model:selectedNode="selectedNode"
        ></sprav-tree>
      </div>
      <div class="ark-grid-right">
        <component
          :is="currentTable"
          v-bind="{ tableInfo: selectedNode2 }"
        ></component>
        <!-- <sprav-table
          v-if="!selectedNode.tableCompon"
          :tableInfo="selectedNode"
        ></sprav-table> -->
      </div>
    </div>
  </ark-card>
</template>

<script>
import { defineComponent, ref, watch, watchEffect } from "vue";
import SpravTree from "components/Sprav/SpravTree.vue";
import SpravTable from "components/Sprav/SpravTable.vue";
import TradeMarkTable from "components/Trademark/TrademarkTable.vue";
import CityTable from "components/City/Table.vue";
import ArkCard from "components/Card/ArkCard.vue";
import NoTable from "components/Sprav/NoTable.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageSprav",
  components: {
    ArkCard,
    SpravTree,
  },
  setup() {
    //  const $q = useQuasar();
    const selectedNode = ref({});
    const selectedNode2 = ref({});
    const $router = useRouter();
    const currentTableName = ref(null);
    const currentTable = ref(SpravTable);

    watchEffect(() => {
      console.log(">", selectedNode.value?.tableType);
      if (!selectedNode.value?.tableType) {
        selectedNode2.value = selectedNode.value;
        selectedNode2.value.prefixDateBase = "sprav";
        currentTable.value = SpravTable;
      } else {
        if (["trademark"].includes(selectedNode.value?.tableType)) {
          selectedNode2.value = selectedNode.value;
          // selectedNode2.value.prefixDateBase = "trademark";
          currentTable.value = TradeMarkTable;
        } else if (["city"].includes(selectedNode.value?.tableType)) {
          selectedNode2.value = selectedNode.value;
          currentTable.value = CityTable;
        } else {
          selectedNode2.value = selectedNode.value;
          selectedNode.value = {};
          currentTable.value = NoTable;
        }
      }
      console.log(
        "Произошел выбор справочника таблиц:",
        currentTable.value?.name,
        selectedNode.value?.tableType
      );
    });

    // function onSelected(node) {
    //   // if (node?.tableName) {
    //   //   console.log("Выбран node", node);
    //   // }
    // }
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
      currentTable,
      selectedNode,
      selectedNode2,
      currentTableName,

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
</style>
