import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { date } from "quasar";
export function useTableFunc(tabUrl) {
  const {
    articleBakeryRows,
    bakerySelectedRow,
    selectedArticleBakeryRow,
    trademarkId,
    showHiddenArticle,
    selectedDateBetweenBakery,
    currentDateSale,
    checkDateSale,
  } = storeToRefs(useSaleStore());
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();

  async function loadBakeryArticle() {
    let aId = selectedArticleBakeryRow.value?.id; // запомним если было выбрано
    let dateTo = dateToDateUnix(selectedDateBetweenBakery.value.to); // до этой даты из диапазона
    if (checkDateSale.value && currentDateSale.value) {
      // если есть галка по дате, и выбрана дата
      dateTo = dateToDateUnix(currentDateSale.value); // берем единичную дату
    }
    let command = {
      cmd: "loadBakeryArticle",
      bakery_id: bakerySelectedRow.value.id,
      trademark_id: trademarkId.value,
      showHiddenArticle: showHiddenArticle.value,
      dateBetween: {
        from: dateToDateUnix(selectedDateBetweenBakery.value.from),
        to: dateTo,
      },
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Артикулы";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Артикулы", url, res);
    if (res.result) {
      articleBakeryRows.value = res.result;
    } else {
      articleBakeryRows.value = [];
    }
    if (aId) {
      // если пропало то ставим пустой объект
      selectedArticleBakeryRow.value =
        articleBakeryRows.value.find((val) => val.id == aId) || {};
    }
  }
  async function toggleHiddenArticle(id, hidden, dateBetween) {
    let command = {
      cmd: "toggleHiddenArticle",
      bakery_id: bakerySelectedRow.value.id,
      price_value_id: id,
      hidden: hidden,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Артикулы видимость";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Артикулы видимость", url, res);
    if (res.result) {
      await loadBakeryArticle();
    } else {
      console.log("Артикулы видимость ошибка", res?.error);
    }
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
    loadBakeryArticle,
    toggleHiddenArticle,
  };
}
