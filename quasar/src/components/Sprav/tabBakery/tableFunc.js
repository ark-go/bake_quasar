import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { date } from "quasar";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  async function loadTable(historyDate, command = { cmd: "load" }) {
    command.historyDate = historyDate;
    let mess = "Загрузка пекарен";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
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
