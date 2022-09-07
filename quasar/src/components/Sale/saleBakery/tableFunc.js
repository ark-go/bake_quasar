import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { useTableFunc as useTableFuncParent } from "../tableFunc.js";
import { date } from "quasar";
export function useTableFunc(tabUrl) {
  const {
    trademarkRows,
    bakeryRows,
    articleBakeryRows,
    territoryRows,
    bakerySelectedRow,
  } = storeToRefs(useSaleStore());
  const { exportPriceExcel } = useTableFuncParent();
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();
  async function loadTrademark() {
    let command = {
      cmd: "loadTrademark",
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "торговые сети";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Торговые сети", url, res);
    if (res.result) {
      trademarkRows.value = res.result;
    } else {
      trademarkRows.value = [];
    }
  }
  async function loadTerritory() {
    let command = {
      cmd: "loadTerritory",
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Территории";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Территории", url, res);
    if (res.result) {
      territoryRows.value = res.result;
    } else {
      territoryRows.value = [];
    }
  }
  async function loadBakery(trademarkId, dateBetween, territoryId) {
    let aId = bakerySelectedRow.value?.id; // запомним если было выбрано
    bakerySelectedRow.value = {}; // сбросим
    let command = {
      cmd: "loadBakery",
      trademark_id: trademarkId,
      dateBetween: {
        from: dateToDateUnix(dateBetween.from),
        to: dateToDateUnix(dateBetween.to),
      },
      territoryId: territoryId,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Пекарни";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Пекарни", url, res);
    if (res.result) {
      bakeryRows.value = res.result;
      if (aId) {
        // если пропало то ставим пустой объект
        bakerySelectedRow.value =
          bakeryRows.value.find((val) => val.id == aId) || {};
      }
    } else {
      bakeryRows.value = [];
    }
    articleBakeryRows.value = [];
  }
  function dateToDateUnix(dat) {
    if (!dat) {
      return null;
    }
    return date.extractDate(dat, dateFormat.value);
  }
  function dateFormatDate(dat) {
    // dat - timeStamp
    return date.formatDate(dat, dateFormat.value);
  }

  return {
    dateToDateUnix,
    dateFormatDate,
    loadTrademark,
    loadBakery,
    loadTerritory,
    exportPriceExcel,
  };
}
