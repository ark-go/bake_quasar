import { ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
import { useUsersPanelStore, storeToRefs } from "stores/usersPanelStore.js";
const { userRow: currentRow, treeRow } = storeToRefs(useUsersPanelStore());
export function useTableFunc(nameTable, rows) {
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
    // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await dataLoad(url, command, mess);
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
    // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await dataLoad(url, body, mess);
    if (res.result) {
      await loadTable();
      return true;
    } else {
      return false;
      //  await loadTable(); // а здесь была ошибка.
    }
  }
  return { loadTable, addUpdateTable };
}
