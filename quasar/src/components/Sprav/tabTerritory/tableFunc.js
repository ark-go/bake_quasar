import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSpravStore } from "stores/spravStore";
import { date } from "quasar";
export function useTableFunc(rows, nameTable) {
  const arkUtils = useArkUtils();
  const spravStore = useSpravStore();
  const dateFormat = ref("DD.MM.YYYY");
  async function loadTable() {
    let command = { cmd: "load" };
    command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      rows.value = res.result;
    } else {
      rows.value = [];
    }
  }
  async function saveRowTable(row) {
    console.log("FFFFFFFFFFFFFFFF", row);
    if (row.id) {
      let command = { cmd: "update" };
      command.row = row;
      command.historyDate = dateToDateUnix(spravStore.historyDate);
      let mess = "Обновление";
      let url = "/api/" + nameTable;
      let res = await arkUtils.dataLoad(url, command, mess);
      if (res.result) {
        await loadTable();
      }
    } else {
      let command = { cmd: "add" };
      command.row = row;
      command.historyDate = dateToDateUnix(spravStore.historyDate);
      let mess = "Добавление";
      let url = "/api/" + nameTable;
      let res = await arkUtils.dataLoad(url, command, mess);
      if (res.result) {
        await loadTable();
      }
    }
  }
  async function deleteTable(row) {
    let command = { cmd: "delete" };
    command.row = row;
    command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Удаление";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      await loadTable();
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
    loadTable,
    saveRowTable,
    deleteTable,
    dateToDateUnix,
    dateFormatDate,
  };
}
