import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import PdfPrinter from "pdfmake/src/printer.js";
import { pool } from "../../postgreSQL/initPostgreSQL.js";
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
export async function createPDF(req, res) {
  var printer = new PdfPrinter(fonts);

  var docDefinition = {
    content: [
      {
        // alignment: "justify", // распределяет текст равномерно
        columns: [
          {
            text: "",
          },
          {
            text: "Приложение № 5\nк договору № 122-31\n от 03.03.2022\nArk",
            //colSpan: 3,
            alignment: "right",
          },
        ],
      },
      // {
      //   style: "tableExample",
      //   widths: ["*", "*", "auto"],
      //   table: {
      //     body: [
      //       [
      //         "",
      //         "",
      //         {
      //           text: "Приложение\nк договору",
      //           //colSpan: 3,
      //           alignment: "right",
      //         },
      //       ],
      //     ],
      //   },
      //   layout: "noBorders",
      // },
      // if you don't need styles, you can use a simple string to define a paragraph
      //"Тестовый вариант создание документа на основе данных.",

      // using a { text: '...' } object lets you set styling properties
      {
        text: "\nСпецификация на поставку лепешек\n",
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
        layout: "lightHorizontalLines", // optional  без этого будут ячейки
        // не понятно style: "tableExample",
        table: {
          // заголовки автоматически повторяются, если таблица занимает несколько страниц
          // вы можете объявить, сколько строк следует рассматривать как заголовки
          headerRows: 1,
          // небыло color: "#444",
          widths: ["auto", "auto", 100, "*"],

          body: [
            ["Первый", "второй", "Третий", "The last one"],
            ["Value 1", "Value 2", 10, "Value 4"],

            [{ text: "Bold value", bold: true }, "Val 2", "Val 3", "Val 4"],
          ],
        },
      },
      {
        text: "\n Вот.\n",
        fontSize: 20,
        alignment: "center",
      },
      {
        text: "\n всё.\n",
        fontSize: 16,
      },
    ],
  };

  let rees = await loadNomenclForPdf(req);
  if (rees.result) {
    let newArr = [];
    rees.result.forEach((row) => {
      let arr = [];
      arr.push(row.nomencl_id);
      arr.push(row.nomencl_name);
      arr.push(row.vidnomencl_name);
      // arr.push(row.vidraw_name);
      arr.push(row.user_date);
      newArr.push(arr);
    }, []);

    newArr.unshift(["ид", "Номенклатура", "ее вид", "дата ввода"]);
    docDefinition.content[2].table.body = newArr;
    // let fff2 = newArr.slice();
    // fff2[0] = ["ид2", "Номенклатура3", "ее вид2", "дата ввода2"];
    // docDefinition.content[4].table.body = fff2;
    // console.log("loadNomenclForPdf", docDefinition.content);
  }

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  //pdfDoc.pipe(fs.createWriteStream("tables5.pdf"));
  //res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  //res.setHeader("Content-Disposition", "attachment; filename=Primer.pdf");
  pdfDoc.pipe(res);
  pdfDoc.end();
}

async function loadNomenclForPdf(req) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let vidNomencl = "";
  if (req.body?.vidNomencl) vidNomencl = req.body?.vidNomencl;
  let sqlP = {
    text: /*sql*/ `
  select 
  nomencl.id as "nomencl_id",
  nomencl.name as "nomencl_name",
  nomencl.meta as "nomencl_meta",
  vidnomencl.id as "vidnomencl_id",
  vidnomencl.name as "vidnomencl_name",
  vidnomencl.meta as "vidnomencl_meta",
  unit.id as "unit_id",
  unit.name as "unit_name",
  groupraw.id as "groupraw_id",
  groupraw.name as "groupraw_name",
  vidraw.id as "vidraw_id",
  vidraw.name as "vidraw_name",
--  recept.nomencl_id as "recept_id",
  to_char(nomencl.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date", --(nomencl.user_date at time zone $1) as "user_date",
-- nomencl.user_date as "user_date",
  users.email as "user_email",
  CASE WHEN recept.nomencl_id IS NULL THEN 'нет' ELSE 'есть' END  AS "recept_check"
  -- NULLIF(recept.id, 'нет') as "re  cept_name"
  FROM  nomencl --nomenclature

  LEFT JOIN  unit ON unit.id = nomencl.unit_id
  LEFT JOIN  vidnomencl ON vidnomencl.id = nomencl.vidnomencl_id
  LEFT JOIN  groupraw ON groupraw.id = nomencl.groupraw_id
  LEFT JOIN  vidraw ON vidraw.id = nomencl.vidraw_id
  LEFT JOIN  (select distinct nomencl_id from recept) as recept ON recept.nomencl_id = nomencl.id --только чтоб получить Да / НЕТ
 -- LEFT JOIN  recept ON recept.nomencl_id = nomencl.id
  LEFT JOIN  users ON users.id = nomencl.user_id
  WHERE nomencl.deleted = FALSE ;
`,
    values: [timezone],
  };

  try {
    let result = await pool.query(sqlP);
    //console.log(result);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log(timezone, result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения nomenclature", err.toString());
    return {
      error: err.toString(),
    };
  }
}
