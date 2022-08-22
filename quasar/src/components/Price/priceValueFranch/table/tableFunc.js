import { ref } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { date } from "quasar";
import { useLoadPriceValueFranch } from "../../loadPriceValueFranch";
import { usePriceStore, storeToRefs } from "stores/priceStore.js"; //  const { priceValueCount } = storeToRefs(usePriceStore());
export function useTableFunc(nameTable) {
  const arkUtils = useArkUtils();
  const loadPriceValueFranch = useLoadPriceValueFranch();
  const dateFormat = ref("DD.MM.YYYY");
  const {
    selectedFranchPrice,
    RowsPriceValueFranch,
    selectedRowPrice,
    tabModel,
  } = storeToRefs(usePriceStore());
  // async function loadTable(price_id) {
  //   // if (tabModel.value != "priceValueFranch") return []; // тоько на таблице франча
  //   let bakery_id = "";
  //   if (selectedFranchPrice.value.length == 1) {
  //     console.log("пекарни все все франчи", selectedFranchPrice.value);
  //     bakery_id = selectedFranchPrice.value[0].price_bakery_id;
  //   }
  //   //! Важно, bakery_id если пусто ??  , и если не пусто то одна печка
  //   let command = {
  //     cmd: "loadPriceValueFranch", //loadPriceValue",
  //     price_id: price_id,
  //     bakery_id: bakery_id,
  //   };
  //   let mess = "Прайс франчайзи";
  //   let url = "/api/tabPrice";
  //   let res = await arkUtils.dataLoad(url, command, mess);
  //   if (res.result) {
  //     return res.result;
  //   } else {
  //     return [];
  //   }
  // }
  async function insertFranchCena(row, price_bakery_id_array, CenaR) {
    // if (price_bakery_id_array.length != 1) throw new Error("Нужно одну печку");
    console.log("Поступило в отправку", CenaR, row, price_bakery_id_array);
    let price_bakery_id_arr = [];
    let kagent_id_arr = [];
    price_bakery_id_array.forEach((element) => {
      price_bakery_id_arr.push(element.price_bakery_id);
      kagent_id_arr.push(element.kagent_franch_id);
    });

    let command = {
      cmd: "insertFranchCena", //loadPriceValue",
      price_value_id: row.id,
      price_bakery_id_arr,
      kagent_id_arr,
      // price_bakery_id: price_bakery_id_array[0].price_bakery_id,
      // kagent_id: price_bakery_id_array[0].kagent_franch_id,
      cena: CenaR ? null : row.franch_cena, // Сброс
      description: row.franch_description,
    };

    let mess = "Запись цены франчайзи";
    let url = "/api/tabPrice";
    let res = await arkUtils.dataLoad(url, command, mess);
    if (res.result) {
      await loadPriceValueFranch.loadTable();
      return res.result;
    } else {
      await loadPriceValueFranch.loadTable();
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

  return { dateToDateUnix, dateFormatDate, insertFranchCena };
}
