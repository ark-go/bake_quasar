<template>
  <ark-card
    title="Контрагенты"
    subTitle="Выбор справочника"
    style="width: 700px"
  >
    <div class="row">
      <div class="col-xs-12 col-sm-5">
        <sprav-tree
          @on-selected="onSelected"
          style="min-width: 100px"
        ></sprav-tree>
      </div>
      <div class="col-xs-12 col-sm-7">
        <sprav-table :tableInfo="tableInfo"></sprav-table>
      </div>
    </div>
  </ark-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import SpravTree from "components/Sprav/SpravTree.vue";
import SpravTable from "components/Sprav/SpravTable.vue";
import ArkCard from "components/Card/ArkCard.vue";

export default defineComponent({
  name: "PageSprav",
  components: {
    ArkCard,
    SpravTree,
    SpravTable,
  },
  setup() {
    const currentTable = ref(null);
    const tableInfo = ref({});
    const currentTableName = ref(null);
    function onSelected(node) {
      if (node?.tableName) {
        //tableName уже точно есть, приходит
        tableInfo.value = node;
        //  currentTableName.value = node?.label;
        currentTable.value = node?.tableName;
        console.log("Выбран node", node);
      }
    }
    return { onSelected, currentTableName, tableInfo };
  },
});
</script>
