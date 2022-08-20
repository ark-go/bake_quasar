<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickEdit="onClickEdit"
      @onClickNew="onClickNew"
      @onDelete="onDelete"
      v-model:trademarkId="trademarkId"
    ></Side-Doc>
    <template v-slot:after>
      <Table-Panel
        :checkSave="checkSave"
        @onRowDblClick="onClickEdit"
      ></Table-Panel>
    </template>
  </Tab-Panel-Split>
  <form-doc v-model:showDialog="showDialog" @onSave="onSave"></form-doc>
</template>
<script>
import { ref, defineComponent, watch, onMounted } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./table/TablePanel.vue";
import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { useTableFunc } from "./tableFunc";
export default defineComponent({
  name: "TabSaleBakery",
  components: { TabPanelSplit, TablePanel, SideDoc, FormDoc },
  setup() {
    const {
      bakerySelectedRow,
      tabModel,
      trademarkId,
      selectedDateBetweenBakery,
    } = storeToRefs(useSaleStore());
    const tableFunc = useTableFunc("tabSale");
    const showDialog = ref(false);
    const checkSave = ref(false);
    // const trademarkId = ref(null);
    onMounted(async () => {
      await tableFunc.loadTrademark();
    });
    watch(
      [() => trademarkId.value, () => selectedDateBetweenBakery.value],
      async () => {
        bakerySelectedRow.value = {}; // Сброс выбора печки
        console.log(
          "trade",
          trademarkId.value,
          selectedDateBetweenBakery.value
        );
        if (
          selectedDateBetweenBakery.value.from &&
          selectedDateBetweenBakery.value.to &&
          trademarkId.value
        ) {
          console.log(
            "load bakery",
            selectedDateBetweenBakery.value.from,
            selectedDateBetweenBakery.value.to
          );
          await tableFunc.loadBakery(
            trademarkId.value,
            selectedDateBetweenBakery.value
          );
        }
      }
    );
    watch(
      () => trademarkId.value,
      () => {}
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
    return {
      showDialog,
      onClickEdit,
      onClickNew,
      onSave,
      checkSave,
      tabModel,
      trademarkId,
    };
  },
});
</script>
