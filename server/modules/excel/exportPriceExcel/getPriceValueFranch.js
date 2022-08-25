import { loadPriceValueFranchExcel } from "../../../postgreSQL/command/tabPrice/loadPriceValueFranchExcel.js";
import { AdjustColumnWidth } from "../util/AdjustColumnWidth.js";

export async function getPriceValueFranch(req, sheetValue, nameTable) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  // bakery_id может быть , если мы хотим именно печку
  if (!req.body.price_bakery_id) req.body.price_bakery_id = -100;
  let PriceValue = await loadPriceValueFranchExcel(req, "", "price", timezone);
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
    row.push(el.article);
    row.push(el.price_name);
    row.push(el.productvid_name);
    row.push(el.cena ? +el.cena : "");
    row.push(el.franch_cena ? +el.franch_cena : "");
    // row.push([
    //   {
    //     font: { color: { argb: "FFFF0000" }, name: "Comic Sans MS" },
    //     text: "eeee",
    //   },
    // ]);
    row.push(el.franch_description || "");
    rowsTab.push(row);
  });
  //console.log(rowsTab);
  sheetValue.addTable({
    name: nameTable,
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Пекарня", filterButton: true },
      { name: "Франчайзи", filterButton: false },
      { name: "Артикул", filterButton: true },
      { name: "Товар маг.", filterButton: true },
      { name: "Продукт", filterButton: true },
      {
        name: "Цена",
        key: "cena",
        filterButton: false,
      },
      {
        name: "Цена фр.",
        key: "frcena",
        filterButton: false,
        style: { font: { color: { argb: "FFFF0000" } } },
      },
      { name: "Комментарий", filterButton: false },
    ],
    rows: rowsTab, // resPrice.result.map(Object.values),

    // [
    //   [new Date("2019-07-20"), 70.1],
    //   [new Date("2019-07-21"), 70.6],
    //   [new Date("2019-07-22"), 70.1],
    // ],
  });
  //const table = sheetValue.getTable(nameTable);
  const column7 = sheetValue.getColumn(7);
  // iterate over all current cells in this column including empty cells
  column7.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
    if (rowNumber == 1) {
      cell.font = { color: { argb: "FF000000" } };
    } else {
      cell.numFmt = "# ##0.00 ₽;[red]-# ##0.00 ₽";
    }
  });
  const column6 = sheetValue.getColumn(6);
  // iterate over all current cells in this column including empty cells
  column6.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
    if (rowNumber == 1) {
      cell.font = { color: { argb: "FF000000" } };
    } else {
      cell.numFmt = "# ##0.00 ₽;[red]-# ##0.00 ₽";
    }
  });
  //console.log("column");
  // column.style = {
  //   font: { color: { argb: "FFFF0000" }, name: "Comic Sans MS" },
  // };
  // table.commit();
  //  const cena = sheetValue.getColumn("cena");
  // iterate over all current cells in this column including empty cells
  //   cena.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  //     //cell.numFmt = "0.00%";
  //     console.log(cell, rowNumber);
  //   });
  //console.log(cena);
  AdjustColumnWidth(sheetValue);
  return PriceValue;
}
