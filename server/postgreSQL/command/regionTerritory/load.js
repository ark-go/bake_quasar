import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.parentId ? "WHERE " +  tabname + ".parentId = $2" : "";
  let wher = "";
  let dateend =
    "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  if (req.body?.parentId) {
    if (req.body.nogroup) {
      // не в группе
      wher = /*sql*/ `WHERE region_g.id <> ${req.body.parentId}`;
    } else {
      // в других группах
      wher = /*sql*/ `WHERE region_g.id = ${req.body.parentId}`;
    }
  }
  if (req.body.free) {
    // свободные, нет в списке разделенных
    wher = /*sql*/ `WHERE region_g.id IS NULL`;
  }

  if (idOne) wher = "WHERE " + tabname + ".id = $2";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      region_g.name as region_name,
      (select count(*) from territory_x_bakery where parent_id = territory.id AND is_last = true ) as bakery_count,

      -- to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
          LEFT JOIN  ( select * from region_x_territory 
                      where  is_last = true ) as tr  ON tr.child_id = ${tabname}.id
          LEFT JOIN  region as region_g ON region_g.id = tr.parent_id
      --LEFT JOIN  region ON region.id = ${tabname}.parentId
      ${wher}
      ORDER BY ${tabname}.name
`,
    values: [],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
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
