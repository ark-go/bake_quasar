import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  const { selectedRowDoc, bakeryFranchPrice, bakeryCount } = storeToRefs(
    usePriceStore()
  );
  async function loadTable() {
    let command = {
      cmd: "loadBakeryDocument",
      datestart: dateToDateUnix(selectedRowDoc.value.datestart),
      price_id: selectedRowDoc.value.id,
    };
    console.log("Загрузка пекарен прайса", command);
    let mess = "Загрузка пекарен прайса";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      bakeryCount.value = res.result.length;
      bakeryFranchPrice.value = [];
      res.result.forEach((value) => {
        if (value.kagent_franch_id) bakeryFranchPrice.value.push(value);
      });
      return res.result;
    } else {
      return [];
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
