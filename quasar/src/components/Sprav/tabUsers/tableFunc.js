import { ref, watch } from "vue";
import { date } from "quasar";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSpravStore } from "stores/spravStore";
import { useIoBroadcast } from "src/utils/ioBroadcast.js";
export function useTableFunc(rows, nameTable) {
  const arkUtils = useArkUtils();
  const spravStore = useSpravStore();
  const dateFormat = ref("DD.MM.YYYY");
  const io = useIoBroadcast(ioBroadcastUpdate, "Управляющие");
  async function ioBroadcastUpdate(param) {
    if (param.tableName == nameTable) {
      // tableName - здесь, название команды, которая обслуживает таблицу.. хз, повелось так
      console.log("ктото обновил нашу таблицу.");
      await loadTable();
    }
  }
  watch(
    () => spravStore.historyDate,
    async () => {
      await loadTable();
    }
  );
  async function loadTable() {
    let command = { cmd: "load", allUsers: true };
    command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Загрузка пользователей";
    let url = "/api/" + nameTable;
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      rows.value = res.result;
    } else {
      rows.value = [];
    }
  }
  function dateToDateUnix(dat) {
    if (!dat) {
      return null;
    }
    return date.extractDate(dat, dateFormat.value);
  }
  return { loadTable };
}
