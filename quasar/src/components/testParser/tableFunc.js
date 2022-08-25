import { ref, nextTick } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { date } from "quasar";
export function useTableFunc() {
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();

  async function sendToParser(urlParse) {
    let command = {
      cmd: "parsertest",
      urlParse: urlParse,
    };
    // command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Parser";
    let url = `/api/testparser`;
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("Артикулы", url, res);
    if (res.result) {
      return res.result;
    } else {
      return [];
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
    sendToParser,
  };
}
