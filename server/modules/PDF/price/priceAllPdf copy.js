import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import PdfPrinter from "pdfmake/src/printer.js";
//import { linesvg } from "./line.js";
import { printnumber } from "../printnumber.js";
import { sendDocument } from "../../../tg/startTgBot.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var fonts = {
  Roboto: {
    //server/modules/pdfark/test.js
    //server/node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf
    normal: "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf", //node_modules/roboto-font/fonts/roboto/  добавка   -webfont.ttf // и все маленькими
    bold: "node_modules/roboto-font/fonts/Roboto/roboto-medium-webfont.ttf",
    italics: "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
    bolditalics:
      "node_modules/roboto-font/fonts/Roboto/roboto-mediumitalic-webfont.ttf",
  },
};
// ----------------------------------------------------------------------------------
export async function priceAllPdf(req, res, result) {
  // req.session.user?.currentPdf?.pdf?.title
  let printnum = await printnumber(); // номер из базы, последовательность
  var printer = new PdfPrinter(fonts);
  var date = new Date();
  let dateCurr = date.toLocaleString("ru-RU", { hour12: false });
  //let pageOrient = "landscape"; //"portrait";
  let pageOrient = "portrait"; //"portrait";

  var docDefinition = {
    pageSize: "A4",
    pageOrientation: pageOrient,
    pageMargins: [25, 20, 15, 20], // [left, top, right, bottom]
    info: {
      creator: "ХиТ",
      producer: "ХиТ",
      title: "Тест4",
      //  author: 'john doe',
      subject: "Отчет",
      //  keywords: 'keywords for document',
    },
    watermark: {
      text: "Лепешки",
      color: "silver",
      opacity: 0.1,
      bold: true,
      italics: false,
    },
    footer: {
      columns: [
        {
          text: "X516",
          alignment: "left",
          margin: [20, 0, 0, 0], // [left, top, right, bottom]
          color: "silver",
        },
        {
          text: 'ИП "Алина Зенникова"',
          alignment: "right",
          margin: [0, 0, 20, 0], // [left, top, right, bottom]
          italics: true,
          color: "silver",
        },
      ],
    },
    //header: { text: "WWWWWWWWWWWWWWWWWWWWWWWWWW" },
    header: function (currentPage, pageCount) {
      if (currentPage > 1) {
        return {
          text: "стр. " + currentPage.toString() + " из " + pageCount,
          style: { fontSize: 8 },
          alignment: "right",
          margin: [0, 0, 10, 0], // [left, top, right, bottom]
        };
      } else {
        return {};
      }
    },
    //! не работает теститруем, должно автоматом переводитьстроку по headlineLevel (убрать в тексе если удалять это)
    pageBreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
    //! ---------------
    content: [
      {
        text:
          "Распечатка № " +
          printnum +
          "\n от " +
          dateCurr +
          '\nпрограмма "X516"',
        //colSpan: 3,
        alignment: "right",
      },
      // {
      //   toc: {
      //     title: { text: "INDEX", style: "header" },
      //   },
      // },
      // {
      //   text: "This is a header",
      //   style: "header",
      //   tocItem: true,
      // },
      {
        text: "Тест3",
        style: { fontSize: 12 },
        alignment: "center",
        margin: [0, 10, 0, 20], // [left, top, right, bottom]
      },
      X(result),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 0], // [left, top, right, bottom]
      },
      mainRows: {
        bold: true,
        fontSize: 10,
        margin: [0, 0, 0, 0],
      },
      mainRowsName: {
        bold: true,
        fontSize: 12,
        margin: [0, 0, 0, 0],
      },
      childRows: {
        fontSize: 10,
        margin: [0, 0, 0, 0],
      },
      childRowsOtstup1: {
        bold: true,
        fontSize: 12,
        margin: [10, 0, 5, 0],
      },
      childRowsOtstup2: {
        fontSize: 10,
        margin: [20, 0, 5, 0],
      },
      childRowsBlueOtstup2: {
        fontSize: 10,
        color: "blue",
        margin: [20, 0, 5, 0],
      },

      childRowsRed: {
        fontSize: 10,
        color: "red",
        margin: [0, 0, 0, 0],
      },
      childRowsBlue: {
        fontSize: 10,
        color: "blue",
        margin: [0, 0, 0, 0],
      },

      childRowsName: {
        fontSize: 10,
        margin: [10, 0, 5, 0],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 20, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        alignment: "center",
      },
    },
  };
  var pdfDoc = "";
  try {
    pdfDoc = printer.createPdfKitDocument(docDefinition);
    // Отправка telegramm
    let fileName = "";
    // console.log("bod", JSON.stringify(req.body, 0, 2));
    // console.log("bod2", JSON.stringify(req.body, 0, 2));
    if (req.body?.commandExt?.fileName) {
      fileName = req.body?.commandExt?.fileName;
    }
    //   if (req.body?.command) {
    pdfDoc.end();
    sendDocument(req, {
      source: pdfDoc,
      filename: fileName + " " + dateCurr.replace(/:/g, "_") + ".pdf",
    });
    //  }

    //pdfDoc.pipe(fs.createWriteStream("tables5.pdf"));
    //res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf"); // открыть или скачать
    //res.setHeader("Content-Disposition", "attachment; filename=Primer.pdf"); // скачать
    // if (!req.body?.command) {
    //   pdfDoc.pipe(res);
    //   pdfDoc.end();
    //   sendDocument(req, {
    //     source: pdfDoc,
    //     filename: fileName + " " + dateCurr + ".pdf",
    //   });
    // } else {
    //console.log("Выход pdf");

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    let g = await toDateUrl(pdfDocGenerator);
    // blob res.setHeader('Access-Control-Allow-Origin','*');
    return {
      result: g,
    };
    // });
    // }

    // "/home/arkadii/Projects/Kanevsky/quasar/tigr.png");
  } catch (err) {
    console.log("pdef error", err.toString());

    //return res.status(404).send("2387642) Ошибка запроса!");
    if (!req.body?.command) {
      return res.status(404).send("2387642) Ошибка запроса!");
    } else {
      return {
        error: "2387642) Ошибка запроса!",
      };
    }
  }

  function toDateUrl(pdfDocGenerator) {
    return new Promise(function (resolve, reject) {
      pdfDocGenerator.getDataUrl((dataUrl) => {
        resolve(dataUrl);
      });
    });
  }

  // -----------------------------------------         -----------------------------------------------
  function X(resultArr) {
    const arrRes = [];
    let templateTableChild = {
      fontSize: 10,
      width: "auto",
      layout: "lightHorizontalLines", // optional  без этого будут ячейки
      table: {
        headerRows: 1,
        body: [],
      },
    };
    resultArr.forEach((element) => {
      // перебираем групппы
      // let temlateTableRazlel = {};
      // let templateTable = {
      //   fontSize: 15,
      //   width: "auto",
      //   layout: "lightHorizontalLines", // optional  без этого будут ячейки
      //   table: {
      //     body: [],
      //   },
      // };
      let arrMain = [];
      // Пекарни   сначала возьмем нужные данные из первого блока
      arrMain.push({
        text: [
          { text: element.bakery_name, fontSize: 16 },
          {
            text: "    " + element?.items[0]?.items[0].kagent_name,
            italics: true,
            fontSize: 12,
            //margin: [20, 0, 0, 0], // [left, top, right, bottom]
          },
        ],
        // element.bakery_name + "  " + element?.items[0]?.items[0].kagent_name,
        style: "mainRowsName",
        colSpan: 6,
        headlineLevel: 1,
        fillColor: "#eeeeee",
        margin: [5, 0, 0, 0], // [left, top, right, bottom]
      });
      //arrMain.push("");

      templateTableChild.table.body.push(arrMain); // первая стока от название самого продукта
      //
      element.items.forEach((element) => {
        let productName = [];
        productName.push({
          text: element.product_name || "",
          //style: "childRowsOtstup1",
          bold: true,
          fontSize: 12,
          margin: [15, 0, 5, 0],
          colSpan: 6,
        });
        //console.log(">>>>>>", element.product_name);
        // productName.push("");
        // productName.push("");
        // productName.push("");
        //productName.push("");
        // productName.push("");
        templateTableChild.table.body.push(productName);

        element.items.forEach((el) => {
          let childSt = "childRows";
          let childStOtsup = "childRowsOtstup2";
          if (el.date_start == el.maxdatestart) {
            childSt = "childRowsBlue";
            childStOtsup = "childRowsBlueOtstup2";
          }
          let arr = [];
          // arr.push({ text: el.name, style: "childRowsName" });
          arr.push({
            text: el.date_start,
            style: childStOtsup,
            alignment: "right",
          });
          arr.push({
            text: el.docprice_docnum,
            style: childStOtsup,
            alignment: "left",
          });
          // arr.push({
          //   text: el.kagent_name,
          //   style: childStOtsup,
          //   alignment: "left",
          // });
          arr.push({
            text: el.price_name || "",
            style: childSt,
          });
          // arr.push({
          //   text: el.product_name || "",
          //   style: childSt,
          // });
          // arr.push({ text: el.ttk || "", style: childSt });
          arr.push({ text: el.article || "", style: childSt });
          arr.push({
            text: el.date_start == el.maxdatestart ? "•" : "",
            style: childSt,
          });
          arr.push({ text: el.docpricelist_sena || "", style: childSt });
          // arr.push({
          //   text: Math.ceil(Number(el.proportion_b)) + " %" || "",
          //   style: childSt,
          //   alignment: "right",
          // });

          // arr.push({
          //   text: el.proportion_b + " %" || "",
          //   style: childSt,
          //   alignment: "right",
          // });
          // arr.push({ text: el.document_num || "", style: childSt });

          templateTableChild.table.body.push(arr);
          // childs.push(templateTable);
        });
      });
      // если хотели отдельные таблицы то тут вставляем ксочки
      //arrRes.push(templateTableChild);
      // конец дети
    });

    arrRes.push(templateTableChild);
    // console.log("для пдф", arrRes);
    templateTableChild.table.body.unshift([
      { text: "Дата действия", style: "tableHeader" },
      { text: "№ доп", style: "tableHeader" },
      // { text: "Контрагент", style: "tableHeader" },
      { text: "Товар магазина", style: "tableHeader" },
      // { text: "ТТК", style: "tableHeader" },
      { text: "Артикул м.", style: "tableHeader" },
      { text: "•", style: "tableHeader" },
      { text: "Цена", style: "tableHeader" },
      //{ text: "x", style: "tableHeader" },
      // { text: "Доля", style: "tableHeader" },
      // { text: "ТТК", style: "tableHeader" },
    ]);
    return arrRes;
    return [
      {
        fontSize: 10,
        // столбцы размером со звезду заполняют оставшееся пространство
        // если столбцов-звездочек несколько, доступная ширина делится поровну
        width: "auto",
        //text: "Second column",
        // layout: "noBorders",
        layout: "lightHorizontalLines", // optional  без этого будут ячейки
        // не понятно style: "tableExample",
        table: {
          // заголовки автоматически повторяются, если таблица занимает несколько страниц
          // вы можете объявить, сколько строк следует рассматривать как заголовки
          // headerRows: 1,
          // небыло color: "#444",
          //widths: ["auto", "auto", 100, "*"],
          // widths: widths,

          body: arrRes,
        },
      },
    ];
  }
}
