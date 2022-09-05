import { ref, nextTick } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSaleStore, storeToRefs } from "stores/saleStore";
import { date } from "quasar";
export function useTableFunc(tabUrl) {
  const { selectedDateBetweenBakery } = storeToRefs(useSaleStore());
  const dateFormat = ref("DD.MM.YYYY");
  const arkUtils = useArkUtils();
  async function exportPriceExcel() {
    if (
      !selectedDateBetweenBakery.value?.from ||
      !selectedDateBetweenBakery.value?.to
    ) {
      return;
    }
    let command = { cmd: "exportPriceExcel" };
    command.dateBetween = {
      from: dateToDateUnix(selectedDateBetweenBakery.value.from),
      to: dateToDateUnix(selectedDateBetweenBakery.value.to),
    };
    command.excelFrom = selectedDateBetweenBakery.value.from;
    command.excelTo = selectedDateBetweenBakery.value.to;
    console.log("exportSaleExcel comand");
    //   command.historyDate = dateToDateUnix(spravStore.historyDate);
    let mess = "Подготовка Excel";
    let url = "/api/exportSaleExcel";
    let res = await arkUtils.dataLoad(url, command, mess);
    console.log("exportPriceExcel возврат", res);
    if (res.result) {
      onClickGetExcel(res.result);
      return true;
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
  function onClickGetExcel(data) {
    if (data) {
      const blob = b64toBlob(
        data.bufferExcel,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      const blobUrl = URL.createObjectURL(blob);
      const anchorTag = document.createElement("a");
      anchorTag.href = blobUrl;

      anchorTag.download = data.fileName; //"My PDF File.xlsx"
      anchorTag.click();
      URL.revokeObjectURL(blobUrl);
    }
  }
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  return {
    dateToDateUnix,
    dateFormatDate,
    exportPriceExcel,
  };
}
