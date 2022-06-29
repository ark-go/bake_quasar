import { ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
import { date } from "quasar";

export function useTableFunc(nameTable, rows) {
  const url = ref("/api/" + nameTable);
  const dateFormat = ref("DD.MM.YYYY");

  async function loadTable(command = { cmd: "load", free: true }) {
    let mess = "Загрузка пекарен";
    // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
    let res = await dataLoad(url.value, command, mess);
    if (res.result) {
      rows.value = res.result;
      return true;
    } else {
      rows.value = [];
      return false;
    }
  }
  async function addToGroup(val) {
    let mess = "Назначение группы";
    let cmdd = val;
    cmdd.dateStart = cmdd.dateStart ? dateToDateUnix(cmdd.dateStart) : null;
    cmdd.cmd = "addToGroup";
    cmdd.transfer = false;
    console.log("Отправляем", cmdd);
    let res = await dataLoad(url.value, cmdd, mess);
    if (res.result) {
      return await loadTable();
      // return res.result;
    } else {
      return [];
    }
  }
  async function getLastBakery() {}

  function dateToDateUnix(dat) {
    return date.extractDate(dat, dateFormat.value);
  }

  return { loadTable, addToGroup };
}
