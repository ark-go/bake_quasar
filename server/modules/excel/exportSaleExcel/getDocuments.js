//! https://openbase.com/js/exceljs/documentation#fonts
//! https://programmersought.com/article/256210009923/#%E5%85%B1%E4%BA%AB%E5%85%AC%E5%BC%8F
// import { load } from "../../../postgreSQL/command/tabPrice/load.js";
import ExcelJS from "exceljs";
import { loadSaleOtchet } from "../../../postgreSQL/command/tabSale/loadSaleOtchet.js";
import { AdjustColumnWidth } from "../util/AdjustColumnWidth.js";
export async function getDocuments(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  // req.body.showHiddenArticle // 6
  req.body.showDoobleArticle = true; // 7

  let PriceValue = await loadSaleOtchet(req, "", "price", timezone);
  if (PriceValue.result && PriceValue.result.length > 0) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    row.push(el.datesale);
    row.push(el.trademark_name);
    // row.push(new Date(el.datestart));
    row.push(el.bakery_name);
    row.push(el.article + "");
    row.push(el.tovar_name);
    row.push(el.productvid_name);
    row.push(el.countsale ? +el.countsale : "");
    row.push(el.cena ? +el.cena : "");
    row.push(el.itogocena ? +el.itogocena : "");

    // row.push({ formula: "[Кол-во]*[Цена]" }); // "[Кол-во]*[Цена]" }); //=[@[Кол-во]]*[@Цена]   //{formula: `[@[Кол-во]]*[@Цена]`, }
    row.push(el.cena_franch ? +el.cena_franch : "");
    row.push(el.itogocena_franch ? +el.itogocena_franch : "");
    // row.push({
    //   formula: `=ЕСЛИ(ЕПУСТО([@[Кагент ф.]]);"";[Кол-во]*[Цена ф.])`,
    // }); // =ЕСЛИ(ЕПУСТО(N8);[Кол-во]*[Цена ф.];"")

    row.push(el.kagent_name);
    row.push(el.kagent_own_name);
    row.push(el.kagent_franch_name);
    row.push(el.docnum);
    row.push(el.user_name);

    row.push(el.territory_name);
    row.push(el.manager_territory);
    //
    row.push(el.city);
    row.push(el.manager_bakery);
    row.push(el.brand);
    row.push(el.region);
    row.push(el.manager_region);
    row.push(el.affiliation_name);
    row.push(el.product_type);
    row.push(el.assortment);
    row.push(el.product_prefix);

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
      { name: "Дата", filterButton: true },
      { name: "Торг сеть", totalsRowLabel: "Всего:", filterButton: true },
      {
        name: "Пекарня.",
        totalsRowFunction: "count",
        filterButton: true,
      },
      { name: "Артикул", filterButton: true }, // не работает- type: ExcelJS.ValueType.String
      { name: "Товар", filterButton: true },
      { name: "Продукт", filterButton: true },
      { name: "Кол-во", filterButton: false, totalsRowFunction: "sum" },
      { name: "Цена", filterButton: false },
      {
        name: "Σ св.",
        filterButton: false,
        totalsRowFunction: "sum",
        width: 20,
      },
      { name: "Цена ф.", filterButton: false },
      { name: "Σ фр.", filterButton: false, totalsRowFunction: "sum" },

      { name: "Кагент", filterButton: true },
      { name: "Кагент с.", filterButton: true },
      { name: "Кагент ф.", filterButton: true },
      { name: "№ док.", filterButton: true },
      { name: "кто ввел", filterButton: true },
      { name: "Территория", filterButton: true },
      { name: "Мен. терр", filterButton: true },
      //
      { name: "Город", filterButton: true },
      { name: "Мен. пекарни", filterButton: true },
      { name: "Бренд", filterButton: true },
      { name: "Регион", filterButton: true },

      { name: "Мен.регион", filterButton: true },
      { name: "Принадлежность", filterButton: true },
      { name: "Тип прод.", filterButton: true },
      { name: "Ассорт", filterButton: true },
      { name: "Преф. прод.", filterButton: true },
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
  sheetValue.mergeCells("A2:C2");
  sheetValue.getCell(
    "A2"
  ).value = `Продажи: ${req.body.excelFrom} - ${req.body.excelTo}`;
  sheetValue.getCell("A2").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  sheetValue.getCell("A2").font = {
    name: "Arial Black",
    color: { argb: "d1191970" },
    family: 2,
    size: 12,
    italic: false,
  };
  // заливка желтый с рисунком
  sheetValue.getCell("A2").fill = {
    type: "pattern",
    pattern: "none", //"darkTrellis" желтый в точках,
    fgColor: { argb: "FFFFFF00" },
    bgColor: { argb: "990000FF" },
  };
  // Замораживаем столбцы - строки
  sheetValue.views = [
    { state: "frozen", xSplit: 3, ySplit: 4 }, //, topLeftCell: 'G10', activeCell: 'A1'}
  ];
  // -------------------------------------------
  // const article = sheetValue.getColumn("Артикул");
  // article.type = ExcelJS.ValueType.String;
  return PriceValue;

  // iterate over all current cells in this column including empty cells
  //   cena.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  //     //cell.numFmt = "0.00%";
  //     console.log(cell, rowNumber);
  //   });
  //console.log(cena);
}
//sheetValue.getCell("A2")
