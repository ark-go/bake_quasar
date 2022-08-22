import { ref, watch } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { usePriceStore, storeToRefs } from "stores/priceStore";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  const priceStore = usePriceStore();
  const { RowsPriceValue, selectedRowPrice, selectedRowDoc, priceValueCount } =
    storeToRefs(usePriceStore());

  // async function loadTable() {
  //   let aId = selectedRowPrice.value?.id; // запомним если было выбрано
  //   let command = {
  //     cmd: "loadPriceValue",
  //     price_id: selectedRowDoc.value.id, // это было параметром
  //   };
  //   let mess = "Прайс позиции";
  //   let url = "/api/tabPrice";
  //   let res = await arkUtils.dataLoad(url, command, mess);
  //   if (res.result) {
  //     RowsPriceValue.value = res.result;
  //     priceValueCount.value = RowsPriceValue.value.length; //Кол- во
  //   } else {
  //     RowsPriceValue.value = [];
  //   }
  //   if (aId) {
  //     // при обновлениитаблицы будем пеерчитывать выбранную чтроку
  //     // если пропало то ставим пустой объект
  //     selectedRowPrice.value =
  //       RowsPriceValue.value.find((val) => val.id == aId) || {};
  //   }
  // }

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
