<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickEdit="onClickEdit"
      @onClickNew="onClickNew"
      @onDelete="onDelete"
      v-model:trademarkId="trademarkId"
      v-model:territoryId="territoryId"
      @onGetExcel="onGetExcel"
    ></Side-Doc>
    <template v-slot:after>
      <Table-Panel
        :checkSave="checkSave"
        @onRowDblClick="onClickEdit"
      ></Table-Panel>
    </template>
  </Tab-Panel-Split>
  <!-- <form-doc v-model:showDialog="showDialog" @onSave="onSave"></form-doc> -->
</template>
<script>
import { ref, defineComponent, watch, onMounted } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./table/TablePanel.vue";
///import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { useTableFunc } from "./tableFunc";
export default defineComponent({
  name: "TabSaleBakery",
  components: { TabPanelSplit, TablePanel, SideDoc },
  setup() {
    const {
      bakerySelectedRow,
      tabModel,
      trademarkId,
      territoryId,
      selectedDateBetweenBakery,
      territoryRows,
    } = storeToRefs(useSaleStore());
    const tableFunc = useTableFunc("tabSale");
    const showDialog = ref(false);
    const checkSave = ref(false);
    onMounted(async () => {
      await tableFunc.loadTerritory();
      await tableFunc.loadTrademark();
    });
    watch(
      [
        () => trademarkId.value,
        () => selectedDateBetweenBakery.value,
        () => territoryId.value,
      ],
      async () => {
        bakerySelectedRow.value = {}; // Сброс выбора печки
        if (
          selectedDateBetweenBakery.value.from &&
          selectedDateBetweenBakery.value.to &&
          trademarkId.value &&
          territoryId.value
        ) {
          // console.log(
          //   "load bakery",
          //   selectedDateBetweenBakery.value.from,
          //   selectedDateBetweenBakery.value.to
          // );
          await tableFunc.loadBakery(
            trademarkId.value,
            selectedDateBetweenBakery.value,
            territoryId.value
          );
        }
      }
    );
    function onClickEdit() {
      // showDialog.value = true;
    }
    function onClickNew() {
      // bakerySelectedRow.value = {};
      // showDialog.value = true;
    }
    function onSave() {
      checkSave.value = !checkSave.value;
    }
    async function onGetExcel() {
      await tableFunc.exportPriceExcel();
    }
    return {
      showDialog,
      onClickEdit,
      onClickNew,
      onSave,
      checkSave,
      tabModel,
      trademarkId,
      territoryId,
      onGetExcel,
    };
  },
});
</script>
