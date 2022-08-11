import { loadPriceValueFranchExcel } from "../../../postgreSQL/command/tabPrice/loadPriceValueFranchExcel.js";

export async function loadPriceValueFranchExcel(req, sheetValue) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  req.body.bakery_id = -100;
  let PriceValue = await loadPriceValueFranchExcel(req, "", "price", timezone);
  if (PriceValue.result) {
    PriceValue = PriceValue.result;
  } else {
    return null;
  }
  let rowsTab = [];
  PriceValue.forEach((el) => {
    let row = [];
    //  row.push(new Date(el.datestart_unix));
    row.push(el.bakery_name);
    row.push(el.kagent_name);
    row.push(el.article);
    row.push(el.price_name);
    row.push(el.productvid_name);
    row.push(el.cena ? +el.cena : "");
    row.push(el.franch_cena ? +el.franch_cena : "");
    row.push(el.description || "");
    rowsTab.push(row);
  });
  //console.log(rowsTab);
  sheetValue.addTable({
    name: "ПрайсФпанчайзи",
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight5",
      showRowStripes: true,
    },
    columns: [
      { name: "Пекарня", filterButton: true },
      { name: "Контрагент", filterButton: true },
      { name: "Артикул", filterButton: true },
      { name: "Товар маг.", filterButton: true },
      { name: "Продукт", filterButton: true },
      { name: "Цена", filterButton: true },
      { name: "Цена франчайзи", filterButton: true },
      { name: "Комментарий", filterButton: true },
    ],
    rows: rowsTab, // resPrice.result.map(Object.values),

    // [
    //   [new Date("2019-07-20"), 70.1],
    //   [new Date("2019-07-21"), 70.6],
    //   [new Date("2019-07-22"), 70.1],
    // ],
  });
  //  const cena = sheetValue.getColumn("cena");
  // iterate over all current cells in this column including empty cells
  //   cena.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
  //     //cell.numFmt = "0.00%";
  //     console.log(cell, rowNumber);
  //   });
  //console.log(cena);
}
