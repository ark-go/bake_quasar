<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickEdit="onClickEdit"
      @onClickNew="onClickNew"
      @onDelete="onDelete"
      v-model:trademarkId="trademarkId"
      @refSelectCard="setRefSelectCard"
      @onSaveManualData="onSaveManualData"
      @onSaveData="onSaveData"
      @onClipboardError="onClipboardError"
      @onGetExcel="onGetExcel"
      @onSaveBuffer="onSaveBuffer"
      @onClickError="onClickError"
      v-model:showDialogBuffer="showDialogBuffer"
      :rows="rowsManualData"
      :visibleSendSave="visibleSendSave"
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
import { useQuasar, copyToClipboard } from "quasar";
export default defineComponent({
  name: "TabSaleItems",
  components: { TabPanelSplit, TablePanel, SideDoc },
  setup() {
    const $q = useQuasar();
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
      saveBufferErrorRows,
      articleBuffer,
    } = storeToRefs(useSaleStore());
    const dateFormat = ref("DD.MM.YYYY");
    const tableFunc = useTableFunc("tabSale");
    const showDialog = ref(false);
    const showDialogBuffer = ref(false);
    const checkSave = ref(false);
    const refSelectCard = ref(null);
    const rowsManualData = ref([]);
    const visibleSendSave = ref(false);
    // const trademarkId = ref(null);
    onMounted(async () => {
      await tableFunc.loadBakeryArticleAndBuffer();
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
          let resA = await tableFunc.loadBakeryArticleAndBuffer();
          if (resA) {
            rowsManualData.value = []; // стираем полученный буфер
            visibleSendSave.value = false;
          }
          // if (refSelectCard.value) refSelectCard.value.correctInputCount();
        }
      }
    );
    async function onHideArticle(menuObj) {
      await tableFunc.toggleHiddenArticle(menuObj.row.id, true);
    }
    async function onShowArticle(menuObj) {
      await tableFunc.toggleHiddenArticle(menuObj.row.id, false);
    }
    function onClipboardError() {
      rowsManualData.value = [];
    }
    async function onSaveManualData(val) {
      visibleSendSave.value = false;
      // отсылка данных из буфера кнопка Тест
      let resMan = await tableFunc.sendTextToTable(val);
      rowsManualData.value = resMan;
      if (val?.column && resMan.length > 0) {
        // columns - после теста
        visibleSendSave.value = true;
      }
    }
    async function onSaveData(val) {
      // подготовка артикулов из буфера к записи
      console.log("Send date table --", val);
      articleBuffer.value = val.rows || [];
      let resS = await tableFunc.loadBakeryArticleAndBuffer();
      if (resS) {
        // 0 - получили без ошибок
        // соединили буфер с таблицей , пока не записали
        showDialogBuffer.value = false;
        visibleSendSave.value = false;
      }
    }
    function onClickEdit() {
      // showDialog.value = true;
    }
    function onClickNew() {
      // bakerySelectedRow.value = {};
      // showDialog.value = true;
    }
    async function onSaveBuffer() {
      // запись готового буфера в базу articleBufferForSale
      await tableFunc.insertBufferToSale();
    }
    function onSave() {
      checkSave.value = !checkSave.value;
    }
    async function onClickError() {
      let clipMess = "";
      saveBufferErrorRows.value.forEach((val) => {
        clipMess += val.datesale + "\t";
        clipMess += val.article + "\t";
        clipMess += val.countsale + "\t";
        clipMess += "\r\n";
      });
      await copyToClipboard(clipMess);

      $q.notify({ type: "positive", message: "Скопировано в буфер" });
    }
    async function onGetExcel() {
      await tableFunc.exportPriceExcel();
    }
    // function onAddDay(countDays) {
    //   console.log("onAddDay", countDays);
    //   saleStore.debonceArticle(() => {
    //     let minimumDate = date.extractDate(
    //       selectedDateBetweenBakery.value.from,
    //       dateFormat.value
    //     );
    //     let maximumDate = date.extractDate(
    //       selectedDateBetweenBakery.value.to,
    //       dateFormat.value
    //     );
    //     let currentDate = date.extractDate(
    //       currentDateSale.value,
    //       dateFormat.value
    //     );
    //     currentDate = date.addToDate(currentDate, { days: countDays });
    //     if (currentDate <= maximumDate && currentDate >= minimumDate) {
    //       currentDateSale.value = date.formatDate(
    //         currentDate,
    //         dateFormat.value
    //       );
    //     }
    //   });
    // }
    function setRefSelectCard(val) {
      // передан ребенком ref на компонент
      refSelectCard.value = val;
    }
    //
    let pressBloked = false;
    // обработка нажатия ENTER
    // async function onKeyEnterCount(val) {
    //   if (pressBloked) return;
    //   console.log("Кол-во:", val);
    //   if (!val) val = Number(val); // переводим в число. что осталось после валидатора
    //   if (val == Number(selectedArticleBakeryRow.value.count_sale)) {
    //     console.log("Ничего не менялось, не будем отправлять");
    //     refSelectCard.value.onClickRowMove(false); // переводим строку вперед
    //     //refSelectCard.value.inputBgColor = "yellow-2";
    //     return;
    //   }
    //   //  saleStore.debonceAddCount(async () => {
    //   let bgColor = ""; // refSelectCard.value?.inputBgColor; // запомним фон инпута
    //   refSelectCard.value.inputBgColor = "blue-6"; // красим фон инпута
    //   let addResult = await tableFunc.addBakeryArticleOneDay(val); // отсылаем число
    //   console.log("получили:::::", addResult);
    //   if (Array.isArray(addResult) && addResult.length == 1) {
    //     // прошло добавление
    //     // await tableFunc.loadBakeryArticleAndBuffer(); // перечитываем таблицу.. зачемто
    //     // мы считаем что строка будет одна
    //     selectedArticleBakeryRow.value.count_sale = addResult[0].countsale;
    //     refSelectCard.value.onClickRowMove(false); // переводим строку вперед
    //     refSelectCard.value.inputBgColor = bgColor; // возвращаем цвет инпута на место
    //   } else if (typeof addResult === "number" && addResult == 1) {
    //     // было удачное удаление
    //     selectedArticleBakeryRow.value.count_sale = ""; // очищаем у себя
    //     refSelectCard.value.onClickRowMove(false); // переводим строку вперед
    //     refSelectCard.value.inputBgColor = bgColor; // возвращаем цвет инпута на место
    //   } else if (addResult === null) {
    //     console.log("нечего удалять, или была ошибка при добавлении");
    //     refSelectCard.value.inputBgColor = "red-4";
    //   } else if (typeof addResult === "number" && addResult == 0) {
    //     console.log("Не добавили почемуто");
    //     refSelectCard.value.inputBgColor = "pink-4"; // по ошибке цвет инпута в красный
    //   } else {
    //     console.log("Не понятно при добавлении кол-ва ", addResult);
    //     refSelectCard.value.inputBgColor = "pink-4"; // по ошибке цвет инпута в красный
    //   }
    //   //  });
    // }
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
      //onAddDay,
      // onKeyEnterCount,
      setRefSelectCard,
      onSaveManualData,
      onClipboardError,
      rowsManualData,
      visibleSendSave,
      onSaveData,
      onGetExcel,
      showDialogBuffer,
      onSaveBuffer,
      onClickError,
    };
  },
});
</script>
