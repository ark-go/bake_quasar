import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  let dateend =
    "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  if (req.body?.territory_id) {
    if (req.body.nogroup) {
      // не в группе
      wher = /*sql*/ `WHERE territory_g.id <> ${req.body.territory_id}`;
    } else {
      // в других группах
      wher = /*sql*/ `WHERE territory_g.id = ${req.body.territory_id}`;
    }
  }
  if (req.body.free) {
    // свободные, нет в списке разделенных
    wher = /*sql*/ `WHERE territory_g.id IS NULL`;
  }

  if (idOne) wher = "WHERE " + tabname + ".id = $2";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,
      territory_g.name as territory_name,
      region_g.name as region_name,
      to_char(tr.date_start at time zone $1,  'DD.MM.YYYY') as "date_start_terr",
      to_char(reg_ter.date_start at time zone $1,  'DD.MM.YYYY') as "date_start_reg",
    -- (select count(*) from bakery_manager where user_id = users.id AND is_last = true ) as bakery_count,

      -- to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.meta
      FROM ${tabname}
          LEFT JOIN  ( select * from territory_x_bakery  -- territory-parent / bakery- child
                      where  is_last = true ) as tr  ON tr.child_id = ${tabname}.id --  пекарни по child
          LEFT JOIN  territory as territory_g ON territory_g.id = tr.parent_id -- территории по parent
          LEFT JOIN  ( select * from region_x_territory -- все активные территории
                      where is_last = true ) as reg_ter ON reg_ter.child_id = tr.parent_id
         -- LEFT JOIN  region_x_territory as reg_ter ON reg_ter.id = tr.parent_id -- регионы по parent
          LEFT JOIN  region as region_g ON region_g.id = reg_ter.parent_id -- территории по parent
      ${wher}
      ORDER BY ${tabname}.name
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
