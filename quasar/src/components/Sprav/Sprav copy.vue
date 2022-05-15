<template>
  <ark-card
    title="Технические справочники"
    subTitle=""
    style="width: 700px"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
  >
    <div class="row">
      <div class="col-xs-12 col-sm-5">
        <sprav-tree
          style="min-width: 100px"
          v-model:selectedNode="selectedNode"
        ></sprav-tree>
      </div>
      <div class="col-xs-12 col-sm-7">
        <sprav-table
          v-if="!selectedNode.tableCompon"
          :tableInfo="selectedNode"
        ></sprav-table>
      </div>
    </div>
  </ark-card>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import SpravTree from "components/Sprav/SpravTree.vue";
import SpravTable from "components/Sprav/SpravTable.vue";
import ArkCard from "components/Card/ArkCard.vue";
//import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageSprav",
  components: {
    ArkCard,
    SpravTree,
    SpravTable,
  },
  setup() {
    //  const $q = useQuasar();
    const selectedNode = ref({});
    const $router = useRouter();
    const currentTableName = ref(null);
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
      // onSelected,
      selectedNode,
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
  gap: 15px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
  }
}
</style>
