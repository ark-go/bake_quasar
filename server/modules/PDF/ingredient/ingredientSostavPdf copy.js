import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import PdfPrinter from "pdfmake/src/printer.js";
//import { linesvg } from "./line.js";
import { printnumber } from "../printnumber.js";
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
export async function ingredientSostavPdf(res, result) {
  let printnum = await printnumber(); // номер из базы, последовательность
  var printer = new PdfPrinter(fonts);
  var date = new Date();
  let dateCurr = date.toLocaleString("ru-RU", { hour12: false });
  let pageOrient = "portrait";

  var docDefinition = {
    pageSize: "A4",
    pageOrientation: pageOrient,
    pageMargins: [25, 15, 15, 20], // [left, top, right, bottom]
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
    content: [
      {
        text:
          "Распечатка № " +
          printnum +
          "\n от " +
          dateCurr +
          "\nтаблица:" +
          "xexexe" +
          '\nпрограмма "X516"',
        //colSpan: 3,
        alignment: "right",
      },
      X(result),

      // {
      //   fontSize: 10,
      //   // столбцы размером со звезду заполняют оставшееся пространство
      //   // если столбцов-звездочек несколько, доступная ширина делится поровну
      //   width: "auto",
      //   //text: "Second column",
      //   // layout: "noBorders",
      //   layout: "lightHorizontalLines", // optional  без этого будут ячейки
      //   // не понятно style: "tableExample",
      //   table: {
      //     // заголовки автоматически повторяются, если таблица занимает несколько страниц
      //     // вы можете объявить, сколько строк следует рассматривать как заголовки
      //     // headerRows: 1,
      //     // небыло color: "#444",
      //     //widths: ["auto", "auto", 100, "*"],
      //     // widths: widths,

      //     body: result,
      //   },
      // },
    ],
  };
  // return res.status(404).send("error: ingredientSostavPdf");
  var pdfDoc = "";
  try {
    pdfDoc = printer.createPdfKitDocument(docDefinition);

    //pdfDoc.pipe(fs.createWriteStream("tables5.pdf"));
    //res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    //res.setHeader("Content-Disposition", "attachment; filename=Primer.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.log("pdef error", err.toString());
    return res.status(404).send("2387642) Ошибка запроса!");
  }
  // -----------------------------------------
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
    resultArr.forEach((element) => {
      // перебираем групппы
      let temlateTableRazlel = {};
      let templateTable = {
        fontSize: 15,
        width: "auto",
        layout: "lightHorizontalLines", // optional  без этого будут ячейки
        table: {
          body: [],
        },
      };
      let arr = [];
      arr.push(element.main_product);
      arr.push(element.massbrutto || "");
      arr.push(element.document_num || "");
      templateTable.table.body.push(arr);

      arrRes.push(templateTable); // вывод таблицы полуфабриката
      // Дети  тут идут дети
      console.log("items", element.items);
      // let childs = [];
      let templateTableChild = {
        fontSize: 10,
        width: "auto",
        layout: "lightHorizontalLines", // optional  без этого будут ячейки
        table: {
          body: [],
        },
      };
      element.items.forEach((el) => {
        let arr = [];
        arr.push(el.name);
        arr.push(el.massbrutto || "");
        arr.push(el.document_num || "");
        templateTableChild.table.body.push(arr);
        // childs.push(templateTable);
      });
      arrRes.push(templateTableChild);
      // конец дети
    });
    console.log("для пдф", arrRes);
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
