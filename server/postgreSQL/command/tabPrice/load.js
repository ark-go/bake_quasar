import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "price";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      price.id,
      price.datestart at time zone $1 as datestart_unix,
      to_char(price.datestart at time zone $1,  'DD.MM.YYYY') as datestart,
      price.docnum,
      price.trademark_id,
      td.name as trademark_name,
      price.kagent_id,
      kag.name as kagent_name,
      price.kagent_own_id,
      kagown.name as kagent_own_name,
      price.pricevid_id,
      vid.name as pricevid_name,

      price.description
      from price
      LEFT JOIN trademark td on td.id = price.trademark_id
      LEFT JOIN kagent kag on kag.id = price.kagent_id
      LEFT JOIN kagent kagown on kagown.id = price.kagent_own_id
      LEFT JOIN docpricevid vid on vid.id = price.pricevid_id
      ${wher}
      ORDER BY price.datestart DESC
`,
    values: [timezone],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("region", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
