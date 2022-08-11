import { ref, watch } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc as useTableFuncBakery } from "../../priceBakery/table/tableFunc.js";
import { useTableFunc as useTableFuncPrice } from "../../priceValue/table/tableFunc.js";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  const tableFuncPriceBakery = useTableFuncBakery();
  const tableFuncPricePrice = useTableFuncPrice();
  const { RowsDocuments, selectedRowDoc } = storeToRefs(usePriceStore());
  async function loadTable(historyDate, command = { cmd: "load" }) {
    let aId = selectedRowDoc.value?.id; // сохраним строку если была выбрана
    command.historyDate = historyDate;
    let mess = "Документы прайса";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      RowsDocuments.value = res.result;
      // при обновлениитаблицы будем пеерчитывать выбранную строку
      if (aId) {
        // ищем и вщсстанавливаем строку, если пропало то ставим пустой объект
        selectedRowDoc.value =
          RowsDocuments.value.find((val) => val.id == aId) || {};
      }
    } else {
      RowsDocuments.value = [];
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
  watch(
    () => selectedRowDoc.value.id,
    async () => {
      console.log("selectedRowDoc tableFunc", selectedRowDoc.value.id);
      await tableFuncPricePrice.loadTable(); // чтам прайс
      await tableFuncPriceBakery.loadTable(); // читаем пекарни из того файла
    }
  );
  return { loadTable, dateToDateUnix, dateFormatDate };
}
