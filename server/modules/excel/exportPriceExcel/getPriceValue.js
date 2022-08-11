import { loadPriceValue } from "../../../postgreSQL/command/tabPrice/loadPriceValue.js";
import { AdjustColumnWidth } from "./util/AdjustColumnWidth.js";
export async function getPriceValue(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let PriceValue = await loadPriceValue(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    //  row.push(new Date(el.datestart_unix));
    row.push(el.article);
    row.push(el.price_name);
    row.push(el.productvid_name);
    row.push(+el.cena);
    row.push(el.description);
    rowsTab.push(row);
  });
  // console.log(PriceValue);
  sheetValue.addTable({
    name: "ПрайсЗначения",
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Артикул", filterButton: true },
      { name: "Товар маг.", filterButton: true },
      { name: "Продукт", filterButton: true },
      { name: "Цена", key: "cena", filterButton: true },
      { name: "Комментарий", filterButton: true },
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
