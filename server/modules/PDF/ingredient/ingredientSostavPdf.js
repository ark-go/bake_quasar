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
      "node_modules/roboto-font/fonts/Roboto/roboto-mediumItalic-webfont.ttf",
  },
};
// ----------------------------------------------------------------------------------
export async function ingredientSostavPdf(req, res, result) {
  // req.session.user?.currentPdf?.pdf?.title
  let printnum = await printnumber(); // номер из базы, последовательность
  var printer = new PdfPrinter(fonts);
  var date = new Date();
  let dateCurr = date.toLocaleString("ru-RU", { hour12: false });
  let pageOrient = "portrait";
  let fileName = "";
  if (req.body?.fileName) {
    fileName = req.body?.fileName;
  }
  var docDefinition = {
    pageSize: "A4",
    pageOrientation: pageOrient,
    pageMargins: [25, 20, 15, 20], // [left, top, right, bottom]
    info: {
      creator: "ХиТ",
      producer: "Х156",
      title: fileName, // показывается в заголовке
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
        text: req?.session?.user?.currentPdf?.pdf?.title,
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
    pdfDoc.end();
    sendDocument(req, {
      source: pdfDoc,
      filename: fileName + " " + dateCurr.replace(/:/g, "_") + ".pdf",
    });
    //  }

    //pdfDoc.pipe(fs.createWriteStream("tables5.pdf"));
    //   pdfDoc.end();
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "attachment; filename=Primer.pdf");
    console.log("Выход pdf ingredientSostavPDf");
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64((data) => {
      // console.log("getBase64", data);
      res.type("text");
      return res.send(data);
    });

    // let g = await toDateUrl(pdfDocGenerator);
    // return {
    //   result: g,
    // };
  } catch (err) {
    console.log("Не получился pdf", err.toString());
    return res.status(500).json({ error: "Не получился pdf" });
  }

  // function toDateUrl(pdfDocGenerator) {
  //   return new Promise(function (resolve, reject) {
  //     pdfDocGenerator.getDataUrl((dataUrl) => {
  //       resolve(dataUrl);
  //     });
  //   });
  // }
  // function toBase64(pdfDocGenerator) {
  //   return new Promise(function (resolve, reject) {
  //     pdfDocGenerator.getBase64((base64) => {
  //       resolve(base64);
  //     });
  //   });
  // }

  // -----------------------------------------         -----------------------------------------------
  function X(resultArr) {
    // let sampleBlock={
    //   fontSize: 10,
    //   width: "auto",
    //   layout: "lightHorizontalLines", // optional  без этого будут ячейки
    //   table:{
    //     body:[]
    //   }
    // }
    const arrRes = [];
    let templateTableChild = {
      fontSize: 10,
      width: "auto",
      layout: "lightHorizontalLines", // optional  без этого будут ячейки
      table: {
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
      arrMain.push({ text: element.main_product, style: "mainRowsName" });
      arrMain.push({ text: "", style: "mainRowsName" });
      if (element?.items.length > 0) {
        arrMain.push({
          text: element.items[0].massbrutto_pf || "",
          style: "mainRows",
        });
        arrMain.push({
          text: element.items[0].massnetto_pf || "",
          style: "mainRows",
        });
        arrMain.push({
          text: element.items[0].massfinish_pf || "",
          style: "mainRows",
        });
        arrMain.push({
          text: "", // пропорция которой нет
          style: "mainRows",
        });
        arrMain.push({
          text: element.items[0].document_num_pf || "",
          style: "mainRows",
        });
      } else {
        arrMain.push("");
        arrMain.push("");
      }

      // templateTable.table.body.push(arrMain);

      // arrRes.push(templateTable); // вывод таблицы полуфабриката
      // Дети  тут идут дети
      //  console.log("items", element.items);// что печатаем
      // если шаблон тут то разделим на таблицы
      // let templateTableChild = {
      //   fontSize: 10,
      //   width: "auto",
      //   layout: "lightHorizontalLines", // optional  без этого будут ячейки
      //   table: {
      //     body: [],
      //   },
      // };
      templateTableChild.table.body.push(arrMain); // первая стока от название самого продукта
      element.items.forEach((el) => {
        let arr = [];
        arr.push({ text: el.name, style: "childRowsName" });
        arr.push({
          text: el.typeprod,
          style: "childRows",
          alignment: "center",
        });
        arr.push({
          text: el.massbrutto || "",
          style: "childRows",
        });
        arr.push({ text: el.massnetto || "", style: "childRows" });
        arr.push({ text: el.massfinish || "", style: "childRows" });
        // arr.push({
        //   text: Math.ceil(Number(el.proportion_b)) + " %" || "",
        //   style: "childRows",
        //   alignment: "right",
        // });
        arr.push({
          text: el.proportion_b + " %" || "",
          style: "childRows",
          alignment: "right",
        });
        arr.push({ text: el.document_num || "", style: "childRows" });

        templateTableChild.table.body.push(arr);
        // childs.push(templateTable);
      });
      // если хотели отдельные таблицы то тут вставляем ксочки
      //arrRes.push(templateTableChild);
      // конец дети
    });

    arrRes.push(templateTableChild);
    // console.log("для пдф", arrRes);
    templateTableChild.table.body.unshift([
      { text: "Наименование", style: "tableHeader" },
      { text: "Тип", style: "tableHeader" },
      { text: "Брутто", style: "tableHeader" },
      { text: "Нетто", style: "tableHeader" },
      { text: "Итог", style: "tableHeader" },
      { text: "Доля", style: "tableHeader" },
      { text: "ТТК", style: "tableHeader" },
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
