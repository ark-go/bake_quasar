import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
export function useLoadPriceValueFranch() {
  console.log("functionale loadPriceValueFranch load");
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");

  const {
    RowsPriceValueFranch,
    selectedRowDoc,
    selectedPriceValueFranch,
    priceValueCount,
    selectedFranchPrice,
  } = storeToRefs(usePriceStore());
  async function loadTable() {
    let bakery_id = "";
    if (selectedFranchPrice.value.length == 1) {
      console.log("пекарни все все франчи", selectedFranchPrice.value);
      bakery_id = selectedFranchPrice.value[0].price_bakery_id;
    }
    //! Важно, bakery_id если пусто ??  , и если не пусто то одна печка

    let aId = selectedPriceValueFranch.value?.id; // запомним если было выбрано
    let command = {
      cmd: "loadPriceValueFranch",
      price_id: selectedRowDoc.value.id, // это было параметром
      bakery_id: bakery_id,
    };
    let mess = "Прайс - франчайзи";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      RowsPriceValueFranch.value = res.result;
      priceValueCount.value = RowsPriceValueFranch.value.length; //Кол- во
    } else {
      RowsPriceValueFranch.value = [];
    }
    if (aId) {
      // при обновлениитаблицы будем пеерчитывать выбранную чтроку
      // если пропало то ставим пустой объект
      selectedPriceValueFranch.value =
        RowsPriceValueFranch.value.find((val) => val.id == aId) || {};
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

  return { loadTable, dateToDateUnix, dateFormatDate };
}
