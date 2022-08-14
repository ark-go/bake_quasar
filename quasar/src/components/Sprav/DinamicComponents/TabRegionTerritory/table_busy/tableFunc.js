import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { date } from "quasar";

export function useTableFunc(nameTable, rows, parentRow) {
  const arkUtils = useArkUtils();
  const url = ref("/api/" + nameTable);
  const dateFormat = ref("DD.MM.YYYY");

  async function loadTable(
    command = { cmd: "load", nogroup: true, parentId: parentRow?.id }
  ) {
    let mess = "Загрузка пекарен";
    let res = await arkUtils.dataLoad(url.value, command, mess);
    if (res.result) {
      rows.value = res.result;
      return true;
    } else {
      rows.value = [];
      return false;
    }
  }
  async function moveToGroup(val) {
    let mess = "Перенос в другую группу";
    let cmdd = val;
    cmdd.dateStart = cmdd.dateStart ? dateToDateUnix(cmdd.dateStart) : null;
    cmdd.cmd = "moveToGroup";
    cmdd.transfer = true;
    console.log("Отправляем перенос", cmdd);
    let res = await arkUtils.dataLoad(url.value, cmdd, mess);
    if (res.result) {
      return await loadTable();
      // return res.result;
    } else {
      return [];
    }
  }
  async function info(val) {
    let mess = "Информация территории";
    let cmdd = val;
    cmdd.cmd = "info";
    console.log("Запрос инфо", cmdd);
    let res = await arkUtils.dataLoad(url.value, cmdd, mess);
    if (res.result) {
      return res.result?.infod;
      // return res.result;
    } else {
      return {};
    }
  }
  async function getLastBakery() {}

  function dateToDateUnix(dat) {
    return date.extractDate(dat, dateFormat.value);
  }
  function dateFormatDate(dat) {
    // dat - timeStamp
    return date.formatDate(dat, dateFormat.value);
  }
  return { loadTable, moveToGroup, info, dateFormatDate };
}
