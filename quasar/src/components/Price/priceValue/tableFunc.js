import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { date } from "quasar";
import { useLoadPriceValue } from "../loadPriceValue";
export function useTableFunc(nameTable) {
  // const spravStore = useSpravStore();
  const loadPriceValue = useLoadPriceValue();
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();
  async function loadProductVid() {
    let command = {
      cmd: "loadPriceValueProductVid",
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Список продукции для выбора";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("справ. продукция", res);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }

  async function addPriceValue(row, price_id) {
    let command = {
      cmd: "addPriceValue",
    };
    command = { ...command, ...row, ...{ price_id: price_id } };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Добавление прайса";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("addPriceValue", res);
    if (res.result) {
      await loadPriceValue.loadTable();
      return res.result;
    } else {
      return null;
    }
  }
  async function deletePriceValue(row) {
    let dial = await arkUtils.confirmDelete(
      "Вы хотите удалить позицию прайса?",
      `Артикул № ${row.article} : ${row.price_name}`
    );
    if (!dial) return;
    let command = {
      cmd: "deletePriceValue",
      price_id: row.id,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Удаление прайса";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("deletePriceValue", res);
    if (res.result) {
      await loadPriceValue.loadTable();
      return res.result;
    } else {
      return null;
    }
  }
  // async function loadTable() {
  //   let command = { cmd: "load" };
  //   // command.historyDate = dateToDateUnix(spravStore.historyDate);
  //   let mess = "Загрузка";
  //   let url = "/api/" + nameTable;
  //   let res = await arkUtils.dataLoad(url, command, mess);
  //   if (res.result) {
  //     rows.value = res.result;
  //   } else {
  //     rows.value = [];
  //   }
  // }
  async function loadPriceValueSelectArticle(article, kagent_id) {
    let command = {
      cmd: "loadPriceValueSelectArticle",
      article,
      kagent_id,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "История артикулов";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      return res.result;
    } else {
      return [];
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
  // async function deleteTable(row) {
  //   let command = { cmd: "delete" };
  //   command.row = row;
  //   //   command.historyDate = dateToDateUnix(spravStore.historyDate);
  //   let mess = "Обновление";
  //   let url = "/api/" + nameTable;
  //   let res = await arkUtils.dataLoad(url, command, mess);
  //   if (res.result) {
  //     await loadTable();
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

  return {
    loadProductVid,
    //loadTable,
    //  saveRowTable,
    //deleteTable,
    dateToDateUnix,
    dateFormatDate,
    addPriceValue,
    deletePriceValue,
    loadPriceValueSelectArticle,
  };
}
