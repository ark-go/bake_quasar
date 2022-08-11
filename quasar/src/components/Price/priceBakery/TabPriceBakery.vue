<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickDelete="onClickDelete"
      @onShowSelectBakery="onShowSelectBakery"
    ></Side-Doc>
    <template v-slot:after>
      <!--  таблицу с печками прайса  -->
      <Table-Panel :checkSave="checkSave"></Table-Panel>
    </template>
  </Tab-Panel-Split>
  <teleport to="body" v-if="selectBakeryShow">
    <Select-Bakery pageMaxHeight="300px" @onSave="onSaveBakeryArray">
      <!-- перечитаем таблицу с печками modal -->
      <Select-Bakery-Table
        :checkReload="checkSave"
        v-model:selected="selectedBakeryModal"
      ></Select-Bakery-Table>
    </Select-Bakery>
  </teleport>
  <!-- <form-doc v-model:showDialog="showDialog" @onSave="onSave"> </form-doc> -->
</template>
<script>
import { ref, defineComponent, watch } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./table/TablePanel.vue";
//import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import SelectBakery from "./selectBakery/ArkCard.vue";
import SelectBakeryTable from "./selectBakery/table/TablePanel.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc as useTableFuncSelectBakery } from "./selectBakery/table/tableFunc.js";
export default defineComponent({
  name: "priceBakery",
  components: {
    TabPanelSplit,
    TablePanel,
    SideDoc,
    // FormDoc,
    SelectBakery,
    SelectBakeryTable,
  },
  setup() {
    const {
      selectedRowBakery,
      selectBakeryShow,
      selectedBakeryPrice,
      selectedBakeryModal,
    } = storeToRefs(usePriceStore());
    // const showDialog = ref(false);
    const checkSave = ref(false);
    //const selectedBakeryId = ref([]);
    const tableFuncSelectBakery = useTableFuncSelectBakery();
    // function onClickEdit() {
    //   showDialog.value = true;
    // }
    function onShowSelectBakery() {
      //showDialog.value = true;
    }
    function onSave() {
      checkSave.value = !checkSave.value;
    }
    async function onSaveBakeryArray() {
      let selectedBakeryId = [];
      selectedBakeryModal.value.forEach((val) => {
        selectedBakeryId.push(val.id);
      });
      console.log("Сохранить печки", selectedBakeryId);
      let res = await tableFuncSelectBakery.addBakeryToPrice(selectedBakeryId);
      if (res > 0) {
        selectedBakeryModal.value = [];
        checkSave.value = !checkSave.value;
      }
    }
    // watch(
    //   () => selectedBakeryModal.value,
    //   () => {
    //     selectedBakeryId.value = [];
    //     selectedBakeryModal.value.forEach((val) => {
    //       selectedBakeryId.value.push(val.id);
    //     });
    //     console.log(
    //       "Выбрано кучка",
    //       selectedBakeryId.value,
    //       selectedBakeryModal.value
    //     );
    //   }
    // );

    async function onClickDelete() {
      let selectedBakeryPriceId = [];
      selectedBakeryPrice.value.forEach((val) => {
        selectedBakeryPriceId.push(val.bakery_id);
      });
      console.log("Удалить печки", selectedBakeryPriceId);
      let res = await tableFuncSelectBakery.deleteBakeryFromPrice(
        selectedBakeryPriceId
      );
      if (res > 0) {
        selectedBakeryPrice.value = [];
        checkSave.value = !checkSave.value;
      }
    }
    return {
      selectedBakeryModal,
      onClickDelete,
      //  showDialog,
      //  onClickEdit,
      onShowSelectBakery,
      onSaveBakeryArray,
      onSave,
      checkSave,
      selectBakeryShow,
    };
  },
});
</script>
