import { ref, nextTick } from "vue";
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
    showDoobleArticle,
    selectedDateBetweenBakery,
    currentDateSale,
    checkDateSale,
  } = storeToRefs(useSaleStore());
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();

  async function loadBakeryArticle() {
    let isGetCount = false;
    let aId = selectedArticleBakeryRow.value?.id; // запомним если было выбрано
    let dateTo = dateToDateUnix(selectedDateBetweenBakery.value.to); // до этой даты из диапазона
    // if (isGetCount) {
    // если запрашиваем по одному дню
    if (checkDateSale.value && currentDateSale.value) {
      // если есть галка по дате, и выбрана дата
      dateTo = dateToDateUnix(currentDateSale.value); // берем единичную дату
      isGetCount = true;
    }
    //}
    let command = {
      cmd: isGetCount ? "loadBakeryArticleOneDay" : "loadBakeryArticle",
      bakery_id: bakerySelectedRow.value.id,
      trademark_id: trademarkId.value,
      showHiddenArticle: showHiddenArticle.value,
      showDoobleArticle: showDoobleArticle.value && !checkDateSale.value, // и если дата снята
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
    if (
      isGetCount &&
      !selectedArticleBakeryRow.value.id &&
      articleBakeryRows.value.length > 0
    ) {
      // таблица по одному дню, не выбрано ничего, и есть записи, - выбираем первую (а можно первую по сортировке таблицы ??)
      selectedArticleBakeryRow.value = articleBakeryRows.value[0];
    }
  }
  async function addBakeryArticleOneDay(countsale) {
    if (!checkDateSale.value || !currentDateSale.value) {
      throw new Error("Нужна дата!");
    }
    if (!selectedArticleBakeryRow.value?.id) {
      throw new Error("Нужно выбрать артикул!");
    }
    if (
      bakerySelectedRow.value.id != selectedArticleBakeryRow.value.bakery_id
    ) {
      throw new Error(
        "Внимание ошибка программы! 7735<br>пекарня не совпадает с имеющейся в базе"
      ); // как это?
    }
    if (trademarkId.value != selectedArticleBakeryRow.value.trademark_id) {
      throw new Error(
        "Внимание ошибка программы! 7735<br>Торговая сеть не совпадает с имеющейся в базе"
      ); // как это?
    }
    // если есть галка по дате, и выбрана дата
    let dateTo = dateToDateUnix(currentDateSale.value); // берем единичную дату
    let command = {
      cmd: "addBakeryArticleOneDay",
      datesale: dateTo,
      bakery_id: selectedArticleBakeryRow.value.bakery_id,
      price_value_id: selectedArticleBakeryRow.value.id,
      trademark_id: trademarkId.value,
      kagent_id: selectedArticleBakeryRow.value.kagent_id,
      kagent_own_id: selectedArticleBakeryRow.value.kagent_own_id,
      kagent_franch_id: selectedArticleBakeryRow.value.kagent_franch_id,
      filename: "",
      countsale: countsale,
      price_id: selectedArticleBakeryRow.value.price_id,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Артикул на запись";
    let url = `/api/${tabUrl}`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Артикулы", url, res);
    if (res.result) {
      return res.result;
    } else {
      return null;
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
    addBakeryArticleOneDay,
  };
}
