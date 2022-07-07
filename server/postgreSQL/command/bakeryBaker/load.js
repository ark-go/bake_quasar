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
      wher = /*sql*/ `WHERE bakery_g.id <> ${req.body.region_id}`;
    } else {
      // в других группах
      wher = /*sql*/ `WHERE bakery_g.id = ${req.body.region_id}`;
    }
  }
  if (req.body.free) {
    // свободные, нет в списке разделенных
    wher = /*sql*/ `WHERE bakery_g.id IS NULL`;
  }

  if (idOne) wher = "WHERE " + tabname + ".id = $2";
  // tabname - users
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.email as name,
      bakery_g.name as bakery_name,
      to_char(tr.date_start at time zone $1,  'DD.MM.YYYY') as "date_on",
      territory_g.name as territory_name,
      region_g.name as region_name,
     -- region_g.name as region_name,
     -- (select count(*) from bakery_x_users_baker where parent_id = bakery.id AND is_last = true ) as baker_count,

      -- to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users as userh ON userh.id = ${tabname}.id
          LEFT JOIN  ( select * from bakery_x_users_baker -- region_x_territory 
                      where  is_last = true ) as tr  ON tr.child_id = ${tabname}.id
          LEFT JOIN  bakery as bakery_g ON bakery_g.id = tr.parent_id
          --
          LEFT JOIN  ( select * from territory_x_bakery -- 
            where  is_last = true ) as tb  ON tb.child_id = tr.parent_id
          LEFT JOIN  territory as territory_g ON territory_g.id = tb.parent_id
          --
          LEFT JOIN  ( select * from region_x_territory -- 
            where  is_last = true ) as rt  ON rt.child_id = tb.parent_id
          LEFT JOIN  region as region_g ON region_g.id = rt.parent_id

      --LEFT JOIN  region ON region.id = ${tabname}.region_id
      ${wher}
      ORDER BY ${tabname}.email
`,
    values: [timezone],
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
