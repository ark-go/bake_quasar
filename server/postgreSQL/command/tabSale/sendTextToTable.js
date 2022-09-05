import { pool } from "../../initPostgreSQL.js";
import momenttz from "moment-timezone";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function sendTextToTable(req, res, tabname, timezone, idOne) {
  let wher = "";
  // console.log("Пришло: ", req.body.text);
  let origin = req.body?.data?.text;
  let column = req.body?.data?.column;
  let lastMulti = req.body.lastMulti || true;
  if (!origin) {
    return {
      error: "Нет текста!",
    };
  }
  let strArr = origin.split("\n");
  let tablePars = [];
  let errorTest = false;
  let errorCount = false;
  console.log("KKKKKKKKKKK", strArr.length);
  strArr.forEach((val, i) => {
    let a = {};
    let cols = val.split("\t");

    cols.forEach((val, i) => {
      let colName = "col-" + (i + 1);
      val = val.trim();
      if (!val) {
        //пустое поле
        if (lastMulti) {
          // комнда брать с предыдущего поля, если текущее пустое
          if (tablePars.length > 0) {
            val = tablePars[tablePars.length - 1][colName]; // возьмем с предыдущего столбца
          }
        }
      }

      //let colName = "col" + i;
      if (!column) {
        a[colName] = val; // не было теста пишем все подряд
        //  tablePars.push(a);
        return; // к следущему
      }
      // режим теста, второй проход

      // ---------   проверка на дату --
      if (column.datesale == colName) {
        let checkDate = momenttz(val, "DD.MM.YYYY", true); //параметр true - строгий отбор
        if (!checkDate.isValid()) {
          errorTest = val;
        }
        a["datesale"] = checkDate.format("DD.MM.YYYY");
      }
      //---------------------- проверка на  article
      if (column.article == colName) {
        a["article"] = val;
      }
      //---------------------- проверка на  count
      if (column.count == colName) {
        if (val) val = val.replace(/,/g, ".");
        let c = Number(val);
        if (isNaN(c)) {
          // режим теста, второй проход
          //   вернет false при ошибке ?  параметр true - строгий отбор
          errorCount = val;
        }
        a["count"] = val;
      }
      //---------------------- проверка на  любое свободное any
      if (column.any == colName) {
        a["any"] = val;
      }
      a["bakery_id"] = req.body.bakery_id;
      a["trademark_id"] = req.body.trademark_id;
      //-------------------------------
    });
    if (column) {
      if (!a["count"]) a["count"] = 0; // если пустое.. то ставим 0
      let idx = tablePars.findIndex((val) => {
        if (
          val["datesale"] == a["datesale"] &&
          val["article"] == a["article"]
        ) {
          return true;
        }
      });
      if (idx != -1) {
        tablePars[idx]["count"] =
          Number(tablePars[idx]["count"]) + Number(a["count"]);
      } else {
        console.log("xxx-1", a);
        tablePars.push(a);
      }
    } else {
      console.log("xxx-2", a);
      tablePars.push(a);
    }
  });
  if (errorTest) {
    return {
      error:
        "Не определить дату: " + errorTest + "<br>Требуется формат DD.MM.YYYY",
    };
  } else if (errorCount) {
    return {
      error:
        "Не определить Количество: " +
        errorCount +
        "<br>Требуется формат число",
    };
  } else {
    return {
      result: tablePars,
    };
  }
}
