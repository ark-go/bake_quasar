import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const dateFormat = ref("DD.MM.YYYY");
  const { selectedRowDoc, RowsModalBakery } = storeToRefs(usePriceStore());
  async function loadTable() {
    console.log("loadBakeryTrademarkKagent from row", selectedRowDoc.value);
    let command = {
      cmd: "loadBakeryTrademarkKagent",
      datestart: selectedRowDoc.value.datestart,
      trademark_id: selectedRowDoc.value.trademark_id,
      kagent_id: selectedRowDoc.value.kagent_id,
      kagent_own_id: selectedRowDoc.value.kagent_own_id,
      price_id: selectedRowDoc.value.id,
    };
    let mess = "Свободные пекарни"; // фильтруются в запросе в базе
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      console.log("Печки получились", res.result);
      RowsModalBakery.value = res.result;
    } else {
      RowsModalBakery.value = [];
    }
  }
  async function addBakeryToPrice(bakeryArray) {
    console.log("Добавляем печки в прайс", selectedRowDoc.value, bakeryArray);
    let command = {
      cmd: "addBakeryToPrice",
      price_id: selectedRowDoc.value.id,
      bakeryArray: bakeryArray,
    };
    let mess = "Добавление пекарен в прайс";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      console.log("Печки получились", res.result);
      await loadTable();
      return res.result; // кол-во добавленных
    } else {
      return 0;
    }
  }
  async function deleteBakeryFromPrice(bakeryArray) {
    let dial = await arkUtils.confirmDelete(
      "Вы хотите удалить пекарни из прайса?",
      `Количество: ${bakeryArray.length} прайс № ${selectedRowDoc.value.docnum}`
    );
    if (!dial) return;
    console.log("Удаляем печки из прайса", selectedRowDoc.value, bakeryArray);
    let command = {
      cmd: "deleteBakeryFromPrice",
      price_id: selectedRowDoc.value.id,
      bakeryArray: bakeryArray,
    };
    let mess = "Удаление пекарен из прайса";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      console.log("Печки удалились?", res.result);
      await loadTable();
      return res.result; // кол-во удаленных
    } else {
      return 0;
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
    loadTable,
    dateToDateUnix,
    dateFormatDate,
    addBakeryToPrice,
    deleteBakeryFromPrice,
  };
}
