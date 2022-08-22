import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { usePriceStore } from "stores/priceStore";
import { date } from "quasar";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  // const spravStore = useSpravStore();
  const dateFormat = ref("DD.MM.YYYY");
  async function loadTrademark(datestart) {
    if (!datestart) return [];
    let command = {
      cmd: "loadTrademark",
      datestart: dateToDateUnix(datestart),
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("trademark load", res);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  async function loadKagent(datestart, trademark_id) {
    if (!datestart || !trademark_id) return [];
    let command = {
      cmd: "loadKagent",
      datestart: dateToDateUnix(datestart),
      trademark_id: trademark_id,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("kagent load", res);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  async function loadKagentOwn(datestart, trademark_id) {
    if (!datestart || !trademark_id) return [];
    let command = {
      cmd: "loadKagentOwn",
      datestart: dateToDateUnix(datestart),
      trademark_id: trademark_id,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("kagent Own load", res);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  async function loadPricevid() {
    let command = {
      cmd: "loadPricevid",
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("loadPricevid", res);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  async function addDocument(row) {
    let command = {
      cmd: "addDocument",
    };
    command = { ...command, ...row };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("addDocument", res);
    if (res.result) {
      return res.result;
    } else {
      return null;
    }
  }
  async function loadTable() {
    let command = { cmd: "load" };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      rows.value = res.result;
    } else {
      rows.value = [];
    }
  }
  // async function saveRowTable(row) {
  //   console.log("FFFFFFFFFFFFFFFF", row);
  //   if (row.id) {
  //     let command = { cmd: "update" };
  //     command.row = row;
  //     //   command.historyDate = dateToDateUnix(spravStore.historyDate);
  //     let mess = "Обновление";
  //     let url = "/api/" + nameTable;
  //     let res = await arkUtils.dataLoad(url, command, mess);
  //     if (res.result) {
  //       await loadTable();
  //     }
  //   } else {
  //     let command = { cmd: "add" };
  //     command.row = row;
  //     //  command.historyDate = dateToDateUnix(spravStore.historyDate);
  //     let mess = "Добавление";
  //     let url = "/api/" + nameTable;
  //     let res = await arkUtils.dataLoad(url, command, mess);
  //     if (res.result) {
  //       await loadTable();
  //     }
  //   }
  // }
  async function deleteTable(row) {
    let command = { cmd: "delete" };
    command.row = row;
    //   command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Обновление";
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
    loadTrademark,
    loadKagent,
    loadKagentOwn,
    loadPricevid,
    addDocument,
    loadTable,
    //  saveRowTable,
    deleteTable,
    dateToDateUnix,
    dateFormatDate,
  };
}
