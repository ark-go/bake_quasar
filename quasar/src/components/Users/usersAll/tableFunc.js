import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useUsersPanelStore, storeToRefs } from "stores/usersPanelStore.js";
const { userRow: currentRow, treeRow } = storeToRefs(useUsersPanelStore());
import { useIoBroadcast } from "src/utils/ioBroadcast.js";
export function useTableFunc(nameTable, rows) {
  const arkUtils = useArkUtils();
  const io = useIoBroadcast(ioBroadcastUpdate, "Пользователи");
  async function ioBroadcastUpdate(param) {
    if (param.tableName == nameTable) {
      // tableName - здесь, название команды, которая обслуживает таблицу.. хз, повелось так
      console.log("ктото обновил нашу таблицу.");
      await loadTable();
    }
  }
  async function loadTable() {
    console.log(
      "захотелось у дерева ",
      treeRow.value?.id,
      "Все: ",
      treeRow.value?.meta
    );
    if (!treeRow.value?.id) {
      rows.value = [];
      return;
    }
    let command = {
      cmd: "load",
      treeId: treeRow.value.id,
      allUsers: treeRow.value?.meta?.allUsers,
      waitConfirm: treeRow.value?.meta?.waitConfirm,
    };
    console.log("хотим таблицу ", nameTable);
    let mess = "Загрузка пекарен";
    // let res = await arkUtils.dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      rows.value = res.result;
    } else {
      rows.value = [];
    }
  }
  async function addUpdateTable(command = { cmd: "load" }) {
    let body = { ...command, ...{ cmd: "add" } };

    console.log("user addUpdate ", nameTable, body);
    let mess = "Пользователи " + body.cmd;
    // let res = await arkUtils.dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, body, mess);
    if (res.result) {
      await loadTable();
      io.sendBroadcast(nameTable);
      return true;
    } else {
      return false;
      //  await loadTable(); // а здесь была ошибка.
    }
  }
  return { loadTable, addUpdateTable };
}
