import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { useSaleStore, storeToRefs } from "stores/saleStore";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  const { bakerySelectedRow } = storeToRefs(useSaleStore());
  async function loadTable() {
    return;
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
