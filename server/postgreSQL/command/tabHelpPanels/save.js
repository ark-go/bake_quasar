import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
import { load } from "./load.js";

export async function save(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - help_panels

  // console.log("save help", req.body);
  // return {
  //   result: [{}],
  // };
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO ${tabname} (code, name, text) 
    VALUES ($1, $2, $3)
    ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    text = EXCLUDED.text;
`,
    values: [req.body.code, req.body.name, req.body.text],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    await pool.query(sqlP);
    return await load(req, res, tabname, timezone, idOne);
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
