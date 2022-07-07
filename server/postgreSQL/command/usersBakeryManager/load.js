import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  let dateend =
    "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  if (req.body?.region_id) {
    if (req.body.nogroup) {
      // не в группе
      wher = /*sql*/ `WHERE tr.parent_id <> ${req.body.region_id}`;
    } else {
      // в других группах
      wher = /*sql*/ `WHERE tr.parent_id = ${req.body.region_id}`;
    }
  }
  if (req.body.free) {
    // свободные, нет в списке разделенных
    wher = /*sql*/ `WHERE tr.parent_id IS NULL`;
  }

  if (idOne) wher = "WHERE " + tabname + ".id = $2";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,
    -- (select count(*) from bakery_manager where user_id = users.id AND is_last = true ) as bakery_count,

      -- to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.meta
      FROM ${tabname}
          LEFT JOIN  ( select * from users_x_bakery_manager 
                      where  is_last = true ) as tr  ON tr.child_id = ${tabname}.id
      ${wher}
      ORDER BY ${tabname}.name
`,
    values: [],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  // console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //   console.log("territory", result);
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
