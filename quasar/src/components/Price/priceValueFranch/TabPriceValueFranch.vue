<template>
  <Tab-Panel-Split>
    <Side-Doc></Side-Doc>
    <template v-slot:after>
      <Table-Panel :checkSave="checkSave"></Table-Panel>
    </template>
  </Tab-Panel-Split>
  <!-- <form-doc v-model:showDialog="showDialog" @onSave="onSave"></form-doc> -->
</template>
<script>
import { ref, defineComponent } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./table/TablePanel.vue";
//import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
//import { useTableFunc } from "./tableFunc";
export default defineComponent({
  name: "valueFranch",
  components: { TabPanelSplit, TablePanel, SideDoc },
  setup() {
    const { selectedRowPrice, tabModel } = storeToRefs(usePriceStore());
    // const tableFunc = useTableFunc("tabPrice");
    // const showDialog = ref(false);
    // const checkSave = ref(false);
    // function onClickEdit() {
    //   showDialog.value = true;
    // }
    // function onClickNew() {
    //   selectedRowPrice.value = {};
    //   showDialog.value = true;
    // }
    // function onSave() {
    //   checkSave.value = !checkSave.value;
    // }
    // async function onDelete() {
    //   let res = await tableFunc.deletePriceValue(selectedRowPrice.value.id);
    //   if (res > 0) checkSave.value = !checkSave.value;
    // }
    return { tabModel };
  },
});
</script>
