import XLSX from "xlsx";
import { parse } from "csv-parse/sync";
// https://www.npmjs.com/package/xlsx#parsing-functions
export async function xlsUpload(req, res) {
  try {
    // console.log("xls update:", req.file);
    var workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    console.log("xls SheetNames:", workbook.SheetNames);
    // let worksheet = workbook.Sheets["Справочник сырья"];
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (req.body?.setSheet >= 0) {
      console.log("setSheet:", req.body.setSheet);
      worksheet = workbook.Sheets[workbook.SheetNames[req.body.setSheet]];
    }
    //console.log("xls Справочник сырья:", worksheet);
    /*
  var cell_address = { c: 1 - 1, r: 77 - 1 };
  // if an A1-style address is needed, encode the address 
  var cell_ref = XLSX.utils.encode_cell(cell_address); // приводит ячейку в нормальный вид - A77
  console.log("xls ячейка 0/76 :", cell_ref);
  console.log("xls ячейка: ", cell_ref, " : ", worksheet[cell_ref]); // A77
  console.log("xls ячейка парам-v: ", cell_ref, " : ", worksheet[cell_ref]?.v); // A77
  console.log("xls допустимый диапазон: ", worksheet["!ref"]);
  console.log("xls допустимый диапазон в коде: ", worksheet["!range"]); //! --------------------
  */
    //var table = XLSX.utils.sheet_to_csv(worksheet);
    // worksheet["!ref"] = "A1:D9000"; // ограничивает рабочую зону
    if (req.body?.range != "null") {
      console.log("Params range:", req.body.range);
      worksheet["!ref"] = req.body.range;
    }
    var table = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      blankrows: false, // пустые строки пропускать
    });

    //   console.log("xls to csv:", table);
  } catch (E) {
    return {
      error: "ошибка разбора-1 xls: " + E.toString(),
    };
  }
  //--------------------------------------=
  //import { Readable } from "stream";
  try {
    return await convertCSV(table);
  } catch (e) {
    return {
      error: "ошибка разбора-2 xls" + e.toString(),
    };
  }
  //----------------------------------------
  // try {
  //   return {
  //     message: "добавлено.",
  //   };
  // } catch (err) {
  //   console.log(`Ошибка xlsUpload`, err.toString());
  //   return {
  //     error: err.toString(),
  //   };
  // }
}
export async function convertCSV(data) {
  if (data.trim() == "") {
    return {
      error: "Нет данных CSV",
    };
  }
  let results = [];

  try {
    results = parse(data.trim(), {
      // ltrim: true, // пробелы с лева
      trim: true,
      skip_empty_lines: true, // пустые строки без всего
      skip_records_with_empty_values: true, // пустые строки с пустыми значениями
      // columns: ["odin", "dva", "tri", "Четыре"],
      // колонки должны соответсвовать кол-ву
    });
  } catch (err) {
    console.log("ERROR CSV:", err);
    return {
      error: "Ошибка разбора CSV" + err.toString(),
    };
  }
  //console.log(results);

  // console.log(">>>>>>", results);
  //console.log(data.csv);

  return {
    dataCsv: results,
  };
}
