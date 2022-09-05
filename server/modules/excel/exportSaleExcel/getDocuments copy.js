// import { load } from "../../../postgreSQL/command/tabPrice/load.js";
import { loadBakeryArticle } from "../../../postgreSQL/command/tabSale/loadBakeryArticle.js";
import { AdjustColumnWidth } from "../util/AdjustColumnWidth.js";
export async function getDocuments(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  // req.body.showHiddenArticle // 6
  req.body.showDoobleArticle = true; // 7

  let PriceValue = await loadBakeryArticle(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    row.push(el.date_start);
    // row.push(new Date(el.datestart));
    row.push(el.article);
    row.push(el.tovar_name);
    row.push(el.productvid_name);
    row.push(el.cena ? +el.cena : "");
    row.push(el.count_sale ? +el.count_sale : "");
    row.push(el.count_sale11 ? +el.count_sale11 : "");
    row.push(el.trademark_name);
    row.push(el.bakery_name);
    row.push(el.price_docnum);
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
      { name: "Артикул.", totalsRowFunction: "count", filterButton: true },
      { name: "Товар", filterButton: true },
      { name: "Продукт", filterButton: true },
      { name: "Цена", filterButton: true },
      { name: "Кол-во", filterButton: true },
      { name: "Кол-во-2", filterButton: true },
      { name: "Торг. сеть", filterButton: true },
      { name: "Пекарня", filterButton: true },
      { name: "№ док.", filterButton: true },
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
  sheetValue.mergeCells("A2:J2");
  sheetValue.getCell("A2").value = "_X_";
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
    bgColor: { argb: "990000FF" },
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
