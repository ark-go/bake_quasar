// https://csv.js.org/project/examples/
import { parse } from "csv-parse/sync";
//import { Readable } from "stream";

export async function convertCSV(req, res) {
  let data = req.body;

  if (data.csv.trim() == "") {
    return {
      error: "Нет данных CSV",
    };
  }
  let results = [];

  try {
    results = parse(data.csv.trim(), {
      // ltrim: true, // пробелы с лева
      trim: true,
      skip_empty_lines: true, // пустые строки без всего
      skip_records_with_empty_values: true, // пустые строки с пустыми значениями
      // columns: ["odin", "dva", "tri", "Четыре"],
      // колонки должны соответсвовать кол-ву
    });
    // t = await Readable.from(data.csv.trim())
    //   .pipe(csv())
    //   .on("data", (dataM) => results.push(dataM))
    //   .on("end", () => {
    //     return results;
    //   });
  } catch (err) {
    console.log("ERROR CSV:", err);
    return {
      error: "Ошибка разбора CSV",
    };
  }
  //console.log(results);

  console.log("CSV action", data.action);
  //console.log(data.csv);

  return {
    dataCsv: results,
  };
}
