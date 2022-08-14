import { loadPriceValueAll } from "../../../postgreSQL/command/tabPrice/loadPriceValueAll.js";
import { AdjustColumnWidth } from "./util/AdjustColumnWidth.js";
export async function getPriceValueAll(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let PriceValue = await loadPriceValueAll(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    //  row.push(new Date(el.datestart_unix));
    row.push(el.datestart_str);
    row.push(el.docnum);
    row.push(el.bakery_name);
    row.push(el.trademark_name);
    row.push(el.kagent_price_name);
    row.push(el.kagent_franch_name);
    row.push(el.article);
    row.push(el.tovar_name);
    row.push(el.productvid_name);
    row.push(el.cena_tovar ? +el.cena_tovar : "");
    row.push(el.cena_franch ? +el.cena_franch : "");
    rowsTab.push(row);
  });
  // console.log(PriceValue);
  sheetValue.addTable({
    name: "ПрайсВесь",
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Дата прайс", filterButton: true },
      { name: "№ док.", filterButton: true },
      { name: "Пекарня", filterButton: true },
      { name: "Сеть", filterButton: true },
      { name: "Контрагент", filterButton: true },
      { name: "Франшиза", filterButton: true },
      { name: "Артикул", filterButton: true },
      { name: "Товар маг.", filterButton: true },
      { name: "Продукт", filterButton: true },
      { name: "Цена", key: "cena", filterButton: true },
      { name: "Цена фр.", filterButton: true },
    ],
    rows: rowsTab, // resPrice.result.map(Object.values),

    // [
    //   [new Date("2019-07-20"), 70.1],
    //   [new Date("2019-07-21"), 70.6],
    //   [new Date("2019-07-22"), 70.1],
    // ],
  });
  AdjustColumnWidth(sheetValue);
  return PriceValue;
  //  const cena = sheetValue.getColumn("cena");
  // iterate over all current cells in this column including empty cells
  //   cena.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  //     //cell.numFmt = "0.00%";
  //     console.log(cell, rowNumber);
  //   });
  //console.log(cena);
}
