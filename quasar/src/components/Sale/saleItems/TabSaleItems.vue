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
        @onHideArticle="onHideArticle"
        @onShowArticle="onShowArticle"
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
  name: "TabSaleItems",
  components: { TabPanelSplit, TablePanel, SideDoc, FormDoc },
  setup() {
    const {
      bakerySelectedRow,
      showHiddenArticle,
      tabModel,
      trademarkId,
      checkDateSale,
      currentDateSale,
    } = storeToRefs(useSaleStore());
    const tableFunc = useTableFunc("tabSale");
    const showDialog = ref(false);
    const checkSave = ref(false);
    // const trademarkId = ref(null);
    onMounted(async () => {
      await tableFunc.loadBakeryArticle();
    });
    watch(
      [
        () => bakerySelectedRow.value,
        () => showHiddenArticle.value,
        () => checkDateSale.value,
        () => currentDateSale.value,
      ],
      async (newVal, oldVal) => {
        // if (newVal != oldVal) articleBakeryRows.value = []; // Сброс загруженных артикулов
        // console.log("trade", trademarkId.value);
        if (bakerySelectedRow.value.id) {
          await tableFunc.loadBakeryArticle();
        }
      }
    );
    async function onHideArticle(menuObj) {
      await tableFunc.toggleHiddenArticle(menuObj.row.id, true);
    }
    async function onShowArticle(menuObj) {
      await tableFunc.toggleHiddenArticle(menuObj.row.id, false);
    }
    // watch(
    //   () => trademarkId.value,
    //   () => {}
    // );
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
      onHideArticle,
      onShowArticle,
    };
  },
});
</script>
