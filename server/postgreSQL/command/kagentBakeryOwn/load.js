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
      wher = /*sql*/ `WHERE kagent_g.id <> ${req.body.territory_id}`;
    } else {
      // в других группах
      wher = /*sql*/ `WHERE kagent_g.id = ${req.body.territory_id}`;
    }
  }
  if (req.body.free) {
    // свободные, нет в списке разделенных
    wher = /*sql*/ `WHERE kagent_g.id IS NULL`;
  }
  console.log("kagenBakery", tabname, req.body);
  if (idOne) wher = "WHERE " + tabname + ".id = $2";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,
      kagent_g.name as kagent_name,
      terr.name as territory_name,
      reg.name as region_name,
      concat(us.u_fam,' ',us.u_name,' ',us.u_otch) as bakery_manager_name,
    --  region_g.name as region_name,
      to_char(tr.date_start at time zone $1,  'DD.MM.YYYY') as "date_start_kagent",
    --  to_char(reg_ter.date_start at time zone $1,  'DD.MM.YYYY') as "date_start_reg",
    -- (select count(*) from bakery_manager where user_id = users.id AND is_last = true ) as bakery_count,

      -- to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.meta
      FROM ${tabname}
          LEFT JOIN  ( select * from kagent_x_bakery_own  -- territory-parent / bakery- child
                      where  is_last = true ) as tr  ON tr.child_id = ${tabname}.id --  пекарни по child
          LEFT JOIN  kagent as kagent_g ON kagent_g.id = tr.parent_id -- территории по parent
      -- мнеджер печки
      LEFT JOIN LATERAL(select * from users_x_bakery_manager_get_last(${tabname}.id) ) 
              as ubm  ON ubm.child_id = ${tabname}.id
      LEFT JOIN users us ON us.id = ubm.parent_id
      -- территория
      LEFT JOIN LATERAL(select * from territory_x_bakery_get_last(${tabname}.id) ) 
                 as tb  ON tb.child_id = ${tabname}.id
      LEFT JOIN territory terr ON terr.id = tb.parent_id
       -- region
      LEFT JOIN LATERAL(select * from region_x_territory_get_last(terr.id) ) 
                 as rt  ON rt.child_id = terr.id
      LEFT JOIN region reg ON reg.id = rt.parent_id


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
