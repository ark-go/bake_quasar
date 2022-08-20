import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { date } from "quasar";
export function useTableFunc(tabUrl) {
  const { trademarkRows, bakeryRows, articleBakeryRows } = storeToRefs(
    useSaleStore()
  );
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
  async function loadBakery(trademarkId, dateBetween) {
    let command = {
      cmd: "loadBakery",
      trademark_id: trademarkId,
      dateBetween: {
        from: dateToDateUnix(dateBetween.from),
        to: dateToDateUnix(dateBetween.to),
      },
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Пекарни";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Пекарни", url, res);
    if (res.result) {
      bakeryRows.value = res.result;
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
  };
}
