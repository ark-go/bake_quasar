import { load } from "../../../postgreSQL/command/tabPrice/load.js";
import { AdjustColumnWidth } from "../util/AdjustColumnWidth.js";
export async function getDocuments(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let PriceValue = await load(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    row.push(new Date(el.datestart_unix));
    row.push(el.docnum);
    row.push(el.trademark_name);
    row.push(el.kagent_name);
    row.push(el.kagent_own_name);
    rowsTab.push(row);
  });
  // console.log(PriceValue);
  sheetValue.addTable({
    name: "ПрайсДокументы",
    ref: "A4",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Дата", totalsRowLabel: "Всего:", filterButton: true },
      { name: "№ Док.", totalsRowFunction: "count", filterButton: true },
      { name: "Торговая сеть", filterButton: true },
      { name: "Контрагент", filterButton: true },
      { name: "Собственный", filterButton: true },
    ],
    rows: rowsTab, // resPrice.result.map(Object.values),

    // [
    //   [new Date("2019-07-20"), 70.1],
    //   [new Date("2019-07-21"), 70.6],
    //   [new Date("2019-07-22"), 70.1],
    // ],
  });
  AdjustColumnWidth(sheetValue);
  // ------------------  про ячейку -----------
  // merge a range of cells
  sheetValue.mergeCells("A2:E2");
  sheetValue.getCell("A2").value = "Все документы, почти...";
  sheetValue.getCell("A2").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  sheetValue.getCell("A2").font = {
    name: "Arial Black",
    color: { argb: "d10000ff" },
    family: 2,
    size: 14,
    italic: false,
  };
  // заливка желтый с рисунком
  sheetValue.getCell("A2").fill = {
    type: "pattern",
    pattern: "darkTrellis",
    fgColor: { argb: "FFFFFF00" },
    bgColor: { argb: "FF0000FF" },
  };
  // -------------------------------------------
  return PriceValue;
  //  const cena = sheetValue.getColumn("cena");
  // iterate over all current cells in this column including empty cells
  //   cena.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  //     //cell.numFmt = "0.00%";
  //     console.log(cell, rowNumber);
  //   });
  //console.log(cena);
}
