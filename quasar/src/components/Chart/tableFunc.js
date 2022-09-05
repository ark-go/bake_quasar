import { ref, nextTick } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { date } from "quasar";
export function useTableFunc(tabUrl) {
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();

  async function loadSaleOtchet() {
    let command = {
      cmd: "loadSaleOtchet",
      bakery_id: 3,
      dateBetween: {
        from: dateToDateUnix("01.01.2022"),
        to: dateToDateUnix("31.12.2022"),
      },
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Отчет";
    let url = `/api/chartQuery`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Отчет", url, res);
    if (res.result) {
      return res.result;
    } else {
      return null;
    }
  }
  async function loadSaleOtchetTovar() {
    let command = {
      cmd: "loadSaleOtchetTovar",
      bakery_id: 3,
      dateBetween: {
        from: dateToDateUnix("01.01.2022"),
        to: dateToDateUnix("31.12.2022"),
      },
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Отчет";
    let url = `/api/chartQuery`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Отчет", url, res);
    if (res.result) {
      return res.result;
    } else {
      return null;
    }
  }
  async function loadSaleOtchetDay() {
    let command = {
      cmd: "loadSaleOtchetDay",
      // bakery_id: 3,
      dateBetween: {
        from: dateToDateUnix("01.01.2022"),
        to: dateToDateUnix("31.12.2022"),
      },
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Отчет";
    let url = `/api/chartQuery`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Отчет", url, res);
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
    dateToDateUnix,
    dateFormatDate,
    loadSaleOtchet,
    loadSaleOtchetTovar,
    loadSaleOtchetDay,
  };
}
