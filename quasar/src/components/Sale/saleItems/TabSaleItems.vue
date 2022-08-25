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
  <!-- <form-doc v-model:showDialog="showDialog" @onSave="onSave"></form-doc> -->
</template>
<script>
import { ref, defineComponent, watch, onMounted } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./table/TablePanel.vue";
//import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { useTableFunc } from "./tableFunc";
import { date } from "quasar";
export default defineComponent({
  name: "TabSaleItems",
  components: { TabPanelSplit, TablePanel, SideDoc },
  setup() {
    const saleStore = useSaleStore();
    const {
      bakerySelectedRow,
      showHiddenArticle,
      showDoobleArticle,
      tabModel,
      trademarkId,
      checkDateSale,
      currentDateSale,
      selectedDateBetweenBakery,
      selectedArticleBakeryRow,
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
        () => showDoobleArticle.value,
        () => checkDateSale.value,
        () => currentDateSale.value,
      ],
      async (newVal, oldVal) => {
        // if (newVal != oldVal) articleBakeryRows.value = []; // Сброс загруженных артикулов
        // console.log("trade", trademarkId.value);
        if (bakerySelectedRow.value.id) {
          await tableFunc.loadBakeryArticle();
          if (refSelectCard.value) refSelectCard.value.correctInputCount();
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
    //
    let pressBloked = false;
    // обработка нажатия ENTER
    async function onKeyEnterCount(val) {
      if (pressBloked) return;
      console.log("Кол-во:", val);
      if (!val) val = Number(val); // переводим в число. что осталось после валидатора
      if (val == Number(selectedArticleBakeryRow.value.count_sale)) {
        console.log("Ничего не менялось, не будем отправлять");
        refSelectCard.value.onClickRowMove(false); // переводим строку вперед
        //refSelectCard.value.inputBgColor = "yellow-2";
        return;
      }
      //  saleStore.debonceAddCount(async () => {
      let bgColor = ""; // refSelectCard.value?.inputBgColor; // запомним фон инпута
      refSelectCard.value.inputBgColor = "blue-6"; // красим фон инпута
      let addResult = await tableFunc.addBakeryArticleOneDay(val); // отсылаем число
      console.log("получили:::::", addResult);
      if (Array.isArray(addResult) && addResult.length == 1) {
        // прошло добавление
        // await tableFunc.loadBakeryArticle(); // перечитываем таблицу.. зачемто
        // мы считаем что строка будет одна
        selectedArticleBakeryRow.value.count_sale = addResult[0].countsale;
        refSelectCard.value.onClickRowMove(false); // переводим строку вперед
        refSelectCard.value.inputBgColor = bgColor; // возвращаем цвет инпута на место
      } else if (typeof addResult === "number" && addResult == 1) {
        // было удачное удаление
        selectedArticleBakeryRow.value.count_sale = ""; // очищаем у себя
        refSelectCard.value.onClickRowMove(false); // переводим строку вперед
        refSelectCard.value.inputBgColor = bgColor; // возвращаем цвет инпута на место
      } else if (addResult === null) {
        console.log("нечего удалять, или была ошибка при добавлении");
        refSelectCard.value.inputBgColor = "red-4";
      } else if (typeof addResult === "number" && addResult == 0) {
        console.log("Не добавили почемуто");
        refSelectCard.value.inputBgColor = "pink-4"; // по ошибке цвет инпута в красный
      } else {
        console.log("Не понятно при добавлении кол-ва ", addResult);
        refSelectCard.value.inputBgColor = "pink-4"; // по ошибке цвет инпута в красный
      }
      //  });
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
