import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import PdfPrinter from "pdfmake/src/printer.js";
import { linesvg } from "./line.js";
import { printnumber } from "./printnumber.js";
import path from "path";
import { rootDir } from "../../dirModule.cjs";

import fs from "fs";
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

//var PdfPrinter = require("../src/printer");
//let printer = new pdfMake.pdfMake(fonts);
//var PdfPrinter = require('pdfmake/src/printer');
export async function createPDF(res, data, tabname) {
  //let imageAlina = path.join(rootDir, "modules", "PDF", "ip.jpg");
  var printer = new PdfPrinter(fonts);
  var date = new Date();
  let dateCurr = date.toLocaleString("ru-RU", { hour12: false });
  // -----------------------
  let newArr = [];
  let widths = [];
  let pageOrient = "portrait";
  if (tabname == "products") {
    // pageOrient = "landscape";
    data.forEach((row) => {
      let arr = [];
      arr.push(row.numstr);
      arr.push(row.prefix);
      arr.push(row.prodname);
      // arr.push(row.nameextonly);
      arr.push(row.prodnameext);
      arr.push(row.prodnameextdop);
      arr.push(row.massa);
      arr.push(row.massfinish);
      arr.push(row.unit_name);
      arr.push({
        text: row.prodttk,
        fillColor: row.prodttk ? "#ffffff" : "#f1cac7",
      });
      // arr.push(row.prodnamedopttk);
      newArr.push(arr);
    }, []);

    // newArr.unshift([
    //   "п.п.",
    //   "Тип",
    //   // "Наименование",
    //   "Название",
    //   "Доп.припарки",
    //   "Вес",
    //   "TTK",
    //   // "Наименование",
    // ]);
    newArr.unshift([
      { text: "п.п.", style: "tableHeader" },
      { text: "Тип", style: "tableHeader" },
      { text: "Вид", style: "tableHeader" },
      { text: "Название", style: "tableHeader" },
      { text: "Доп.припарки", style: "tableHeader" },
      { text: "Вес", style: "tableHeader" },
      { text: "ВесТТК", style: "tableHeader" },
      { text: "ед.изм.", style: "tableHeader" },
      { text: "TTK", style: "tableHeader" },
    ]);
    widths = [
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "*",
    ];
    console.log("pdf row size ", newArr[0].length);
  }
  // ----------------------------------------------------------------------
  else if (1 == 1) {
    data.forEach((row) => {
      let arr = [];
      arr.push("");
      arr.push(row.numstr);
      arr.push(row.name);
      arr.push("");
      // arr.push(row.id);
      newArr.push(arr);
    }, []);
    newArr.unshift(["", "п.п.", "Наименование", ""]);

    widths = ["*", "auto", "auto", "*"];
    console.log("pdf row size ", newArr[0].length);
  }
  // --------------------------------------------------------------------------
  //docDefinition.content[2].table.body = newArr;
  //docDefinition.content[2].table.widths = ["*", "auto", "auto", "*"];

  //docDefinition.content[2].table.widths = Array(newArr[0].length).fill("auto"); //  ["auto", "auto"],
  //--------------------------
  let printnum = await printnumber(); // номер из базы, последовательность
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
        // alignment: "justify", // распределяет текст равномерно
        columns: [
          {
            text: "",
          },
          {
            text:
              "Распечатка № " +
              printnum +
              "\n от " +
              dateCurr +
              "\nтаблица:" +
              tabname +
              '\nпрограмма "X516"',
            //colSpan: 3,
            alignment: "right",
          },
        ],
      },

      // если вам не нужны стили, вы можете использовать простую строку для определения абзаца
      //"Тестовый вариант создание документа на основе данных.",
      {
        text: "\nТаблица: " + tabname + "\n",
        fontSize: 20,
        alignment: "center",
        margin: [2, 6],
      },

      // если вы установите значение text в массив вместо строки, вы сможете
      // индивидуально стилизовать любую часть
      // {
      //   text: [
      //     " Готовим спецификацию, пока решают какие поля там есть ",
      //     { text: " ЛЯ ", fontSize: 15 },
      //     " ну есть где развернуться.",
      //   ],
      // },
      {
        columns: [
          {
            //столбцы с автоматическим размером имеют ширину в зависимости от их содержимого
            width: "*",
            text: "",
          },
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
              headerRows: 1,
              // небыло color: "#444",
              //widths: ["auto", "auto", 100, "*"],
              widths: widths,

              body: newArr,
            },
          },
          {
            // fixed width
            width: "*",
            text: "",
          },
        ],
      },
      // {
      //   alignment: "center",
      //   svg: linesvg,
      //   width: 300,
      //   //  height: 400,
      // },
      // {
      //   alignment: "right",
      //   //image: "/home/arkadii/Projects/Kanevsky/server/modules/PDF/ip.jpg",
      //   image: imageAlina,
      //   fit: [100, 100],
      //   // pageBreak: "after",
      //   margin: [0, 20, 30, 0], // [left, top, right, bottom]
      // },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10], // [left, top, right, bottom]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
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
    defaultStyle: {
      // alignment: 'justify'
    },
  };

  var pdfDoc = "";
  try {
    pdfDoc = printer.createPdfKitDocument(docDefinition);

    //pdfDoc.pipe(fs.createWriteStream("tables5.pdf"));
    //res.setHeader("Content-Length", stat.size);
    // ----------------------------------------------- работало
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");
    // хрень res.setHeader("ETag", "5e15153d-120f" + printnum);
    //res.setHeader("Content-Disposition", "attachment; filename=Primer.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
    //---------------------------

    //----------------------------

    // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // pdfDocGenerator.getBase64((data) => {
    //   res.json({
    //     result: data,
    //   });
    // });
    //------------------------------------
    // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // pdfDocGenerator.getDataUrl((dataUrl) => {
    //   res.json({
    //     result: dataUrl,
    //   });
    // });
  } catch (err) {
    console.log("pdef error", err.toString());
    return res.status(404).send("2387642) Ошибка запроса!");
  }
}
