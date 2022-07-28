import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  async function loadTable(command = { cmd: "load" }) {
    let mess = "Загрузка пекарен";
    // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      return res.result;
    } else {
      return [];
    }
  }
  return { loadTable };
}
