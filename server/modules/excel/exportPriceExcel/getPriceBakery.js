import { loadBakeryDocument } from "../../../postgreSQL/command/tabPrice/loadBakeryDocument.js";
import { AdjustColumnWidth } from "./util/AdjustColumnWidth.js";
export async function getPriceBakery(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let PriceValue = await loadBakeryDocument(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    //  row.push(new Date(el.datestart_unix));
    row.push(el.bakery_name);
    row.push(el.kagent_franch_name);
    rowsTab.push(row);
  });
  // console.log(PriceValue);
  sheetValue.addTable({
    name: "ПрайсПекарниФранчайзи",
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Пекарня", filterButton: true },
      { name: "Франчайзи", filterButton: true },
    ],
    rows: rowsTab, // resPrice.result.map(Object.values),
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
