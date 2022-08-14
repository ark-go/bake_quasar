import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { getDocuments } from "./getDocuments.js";
import { getPriceValue } from "./getPriceValue.js";
import { getPriceValueFranch } from "./getPriceValueFranch.js";
import { getPriceBakery } from "./getPriceBakery.js";
import { getPriceValueAll } from "./getPriceValueAll.js";
export async function exportPriceExcel(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  req.body.datestart_str = moment
    .tz(req.body.datestart, timezone)
    .format("DD.MM.YYYY");
  console.log("exportPriceExcel: прайс-", req.body.datestart_str);
  /* приходит в запросе
exportPriceExcel: {
  cmd: 'exportPriceExcel',
  price_id: '18',
  datestart: '2022-05-01T00:00:00.000Z',
  docnum: '0202',
  kagent_name: 'Дикси Юг'
  datestart_str: '01.05.2022',
}
*/

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "A516 (" + req.session.user?.email + ")";
  workbook.lastModifiedBy = req.session.user?.email;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  // Set workbook dates to 1904 date system
  // workbook.properties.date1904 = true; //! изучать в новых 1900
  // Force workbook calculation on load
  workbook.calcProperties.fullCalcOnLoad = true; // принудительный расчет парамтров при загрузке

  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0, // хз
      activeTab: 0, // какую вкладку открывать
      visibility: "visible",
    },
  ];
  let fileName = "Прайс " + req.body.docnum + " " + req.body.kagent_name;
  const sheetDocum = workbook.addWorksheet("Список документов", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
    headerFooter: { firstHeader: "Лепеха", firstFooter: "Бу-бу-бу" },
    properties: { tabColor: { argb: "550000FF" } }, // синий 00FF00 зеленый
  });
  sheetDocum.pageSetup.margins = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3,
  };

  //------------ Читаем прайс
  let docum = await getDocuments(req, sheetDocum);
  //  let rowCount = sheetDocum.row.cellCount; //lastRow;
  //const rowCount = sheetDocum.lastRow.rowNumber;
  // -- установим границу печати
  if (docum) {
    let i = docum.length;
    if (i > 4) {
      i = i + 4 + 1; // 4 начало таблицы, 1 - строка Тотал;
      console.log("кол-воЖ", i);
      sheetDocum.pageSetup.printArea = `A4:E${i}`;
    }
  }
  //+++++++++++++++++++++++++++++++++++ все что есть
  const sheetValueAll = workbook.addWorksheet("Все данные", {
    headerFooter: { firstHeader: "Лепеха Прайс", firstFooter: "Бу-бу-бу" },
    properties: { tabColor: { argb: "55FF0000" } }, // синий 00FF00 зеленый
    pageSetup: { printTitlesRow: "1:1" },
  });

  await getPriceValueAll(req, sheetValueAll);
  //+++++++++++++++++++++++++++++++++++
  const sheetValue = workbook.addWorksheet("Прайс", {
    headerFooter: { firstHeader: "Лепеха Прайс", firstFooter: "Бу-бу-бу" },
    properties: { tabColor: { argb: "5500FF00" } }, // синий 00FF00 зеленый
  });

  await getPriceValue(req, sheetValue);

  //+++++++++++++++++++++++++
  const sheetValueFranch = workbook.addWorksheet("франчайзи прайс", {
    headerFooter: { firstHeader: "Лепеха Прайс", firstFooter: "Бу-бу-бу" },
  });

  await getPriceValueFranch(req, sheetValueFranch, "ПрайсФранчайзи");

  //+++++++++++++++++
  const sheetBakery = workbook.addWorksheet("Пекарни франчайзи", {
    headerFooter: { firstHeader: "Лепеха Прайс", firstFooter: "Бу-бу-бу" },
  });
  let bakeryFranchArr = await getPriceBakery(req, sheetBakery);
  if (bakeryFranchArr) {
    // AdjustColumnWidth(sheetBakery);

    for (const bakery of bakeryFranchArr) {
      req.body.price_bakery_id = bakery.price_bakery_id;
      req.body.bakery_id = bakery.bakery_id;
      let sheetPriceBakery = workbook.addWorksheet(
        bakery.bakery_name.replace(/[ ,\*\?\:\\/\[\]]/g, " "),
        {
          headerFooter: {
            firstHeader: "Лепеха Прайс",
            firstFooter: "Бу-бу-бу",
          },
        }
      );
      await getPriceValueFranch(
        req,
        sheetPriceBakery,
        bakery.bakery_name.replace(/[ ,\*\?\:\\/\[\]]/g, "_")
      );
    }
  }
  //   const table = sheet.getTable("MyTable");
  //   table.addRow([new Date("2019-08-10"), 10, "End"]);
  // insert new column (with data) at index 1
  //   table.addColumn(
  //     // {
  //     //   name: "Letter",
  //     //   totalsRowFunction: "custom",
  //     //   totalsRowFormula: "ROW()",
  //     //   totalsRowResult: 6,
  //     //   filterButton: true,
  //     // },
  //     ["a", "b"]
  //   );

  // commit the table changes into the sheet
  //   table.commit();
  //--------------------------------
  //await workbook.commit();
  //await workbook.xlsx.writeFile("testExceltest.xlsx");

  //---------------  обойдем все листы
  workbook.eachSheet(function (worksheet, sheetId) {
    //Пройти по всем листам
    // if (sheetId == 1) return; // пропустить
    worksheet.pageSetup.paperSize = 9;
    worksheet.pageSetup.orientation = "landscape";
    worksheet.pageSetup.fitToPage = true; // вписать лист при печати
    worksheet.pageSetup.fitToWidth = 1; // сколько страниц вширину печатать если включен fitToPage  2 - и больше разобъет таблицу
    worksheet.pageSetup.fitToHeight = 30; // сколько страниц в высоту?  если включен fitToPage 1 - не понятно что смотерт в Екселе yfcnhjqrb
    worksheet.pageSetup.blackAndWhite = true; // печать без цвета
    worksheet.pageSetup.showGridLines = true; // раз без цвета то поставим динии к строкам
    worksheet.pageSetup.horizontalCentered = true; // центрировать по горизонтали
    // worksheet.pageSetup.verticalCentered = true; // центрировать по вертикали
    // worksheet.pageSetup.differentFirst = true // различать колонтитулы первой страница
    worksheet.headerFooter.firstFooter = "A516"; // первой страницы / firstHeader
    // worksheet.headerFooter.differentOddEven = true; // включит раздельные футеры для четных нечетных
    if (worksheet.name == "Все данные")
      // имя не таблицы !! а листа
      worksheet.headerFooter.oddHeader = "Все что есть в базе &K00ff00";
    else worksheet.headerFooter.oddHeader = "&L&F&K00ff00";
    worksheet.headerFooter.oddFooter = "made in &BLepёshka©&B &F&K00ff00 &R&D"; // не четные по умолчию т.е. всегда если не включено раздельное differentOddEven
    worksheet.headerFooter.evenFooter = "made in &Blepёshka© "; // четные
    worksheet.pageSetup.margins = {
      left: 0.4, //10мм
      right: 0.4,
      top: 0.4,
      bottom: 0.4,
      header: 0.2,
      footer: 0.2,
    };
  });
  // ---------------------------------

  const buffer = await workbook.xlsx.writeBuffer();
  return res.json({
    result: {
      bufferExcel: buffer.toString("base64"),
      fileName: `${fileName}.xlsx`,
      username: req.session.user?.username || req.session.user?.email,
      email: req.session.user?.email,
      roles: req.session.user?.roles,
    },
  });
}
