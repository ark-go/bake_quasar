<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickEdit="onClickEdit"
      @onClickNew="onClickNew"
      @onDelete="onDelete"
      v-model:trademarkId="trademarkId"
      @onAddDay="(val) => onAddDay(val)"
      @onKeyEnterCount="onKeyEnterCount"
      @refSelectCard="setRefSelectCard"
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
import { date } from "quasar";
export default defineComponent({
  name: "TabSaleItems",
  components: { TabPanelSplit, TablePanel, SideDoc, FormDoc },
  setup() {
    const saleStore = useSaleStore();
    const {
      bakerySelectedRow,
      showHiddenArticle,
      tabModel,
      trademarkId,
      checkDateSale,
      currentDateSale,
      selectedDateBetweenBakery,
    } = storeToRefs(useSaleStore());
    const dateFormat = ref("DD.MM.YYYY");
    const tableFunc = useTableFunc("tabSale");
    const showDialog = ref(false);
    const checkSave = ref(false);
    const refSelectCard = ref(null);
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
    function onAddDay(countDays) {
      console.log("onAddDay", countDays);
      saleStore.debonceArticle(() => {
        let minimumDate = date.extractDate(
          selectedDateBetweenBakery.value.from,
          dateFormat.value
        );
        let maximumDate = date.extractDate(
          selectedDateBetweenBakery.value.to,
          dateFormat.value
        );
        let currentDate = date.extractDate(
          currentDateSale.value,
          dateFormat.value
        );
        currentDate = date.addToDate(currentDate, { days: countDays });
        if (currentDate <= maximumDate && currentDate >= minimumDate) {
          currentDateSale.value = date.formatDate(
            currentDate,
            dateFormat.value
          );
        }
      });
    }
    function setRefSelectCard(val) {
      // передан ребенком ref на компонент
      refSelectCard.value = val;
    }
    async function onKeyEnterCount(val) {
      console.log("Кол-во:", val);
      saleStore.debonceAddCount(async () => {
        let count = await tableFunc.addBakeryArticleOneDay(val);
        if (count == 1) {
          await tableFunc.loadBakeryArticle();
          refSelectCard.value.onClickRowMove(false);
        }
      });
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
      onAddDay,
      onKeyEnterCount,
      setRefSelectCard,
    };
  },
});
</script>
