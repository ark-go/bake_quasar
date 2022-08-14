import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";

import { date } from "quasar";

export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");

  async function loadTrademark(datestart) {
    if (!datestart) return [];
    let command = {
      cmd: "loadTrademark",
      datestart: dateToDateUnix(datestart),
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Торг.сети";
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
    let mess = "Кагенты";
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
    let mess = "Кагенты собств.";
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
    let mess = "Виды документа";
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
    //  arkUtils.confirmDelete("Вы хотите удалить докумен?", () => {
    //   console.log("Привет вот из диалога Ок");
    // });
    let command = {
      cmd: "addDocument",
    };
    command = { ...command, ...row };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Добавление дкумента";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("addDocument", res);
    if (res.result) {
      return res.result;
    } else {
      return null;
    }
  }
  async function deleteDocument(row) {
    let dial = await arkUtils.confirmDelete(
      "Вы хотите удалить документ?",
      `Документ № ${row.docnum} от ${row.datestart}`
    );
    if (!dial) return;
    let command = {
      cmd: "deleteDocument",
      document_id: row.id,
    };
    let mess = "Удаление";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("deleteDocument", res);
    if (res.result) {
      return res.result;
    } else {
      return null;
    }
  }
  async function loadTable() {
    let command = { cmd: "load" };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Документы";
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
  //     let mess = "Обновление документа";
  //     let url = "/api/" + nameTable;
  //     let res = await arkUtils.dataLoad(url, command, mess);
  //     if (res.result) {
  //       await loadTable();
  //     }
  //   } else {
  //     let command = { cmd: "add" };
  //     command.row = row;
  //     //  command.historyDate = dateToDateUnix(spravStore.historyDate);
  //     let mess = "Добавление документа";
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
    let mess = "Удаление ???";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      await loadTable();
    }
  }
  async function exportPriceExcel(row) {
    let command = { cmd: "exportPriceExcel" };
    command.price_id = row.id;
    command.datestart = row.datestart_unix;
    command.docnum = row.docnum;
    command.kagent_name = row.kagent_name;
    console.log("exportPriceExcel comand", row);
    //   command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Подготовка Excel";
    let url = "/api/exportPriceExcel";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("exportPriceExcel возврат", res);
    if (res.result) {
      return res.result;
    } else {
      return null;
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
    deleteDocument,
    loadTable,
    //  saveRowTable,
    deleteTable,
    dateToDateUnix,
    dateFormatDate,
    exportPriceExcel,
  };
}
