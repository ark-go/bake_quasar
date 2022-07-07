import { ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
export function useTableFunc(nameTable) {
  async function loadTable(command = { cmd: "load" }) {
    let mess = "Загрузка пекарен";
    // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await dataLoad(url, command, mess);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  return { loadTable };
}
