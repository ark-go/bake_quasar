import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //!
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,

      NullIf( (select count(*) from trademark_x_bakery_get_bakery_ondate(${tabname}.id, $1 AT TIME ZONE $2) )
      ,0) as bakery_count
     -- concat(ustm.u_fam,' ',ustm.u_name,' ',ustm.u_otch) as territory_manager_name,
    --  reg.name as region_name,
    --  concat(usrm.u_fam,' ',usrm.u_name,' ',usrm.u_otch) as region_manager_name,
    --  NullIf( (select count(*) from territory_x_bakery_get_bakery_ondate(${tabname}.id, $1 AT TIME ZONE $2) )
    --  ,0) as bakery_count

      from ${tabname}
      -- LEFT JOIN LATERAL(select * from trademark_x_bakery_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
      --          as tb  ON tb.child_id = ${tabname}.id
      --  LEFT JOIN bakery bkr ON bkr.id = tb.parent_id
       --
      --  LEFT JOIN LATERAL(select * from region_x_territory_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
      --            as rt  ON rt.child_id = ${tabname}.id
      --  LEFT JOIN region reg ON reg.id = rt.parent_id
       --
      --  LEFT JOIN LATERAL(select * from users_x_region_manager_get_last(rt.parent_id,$1 AT TIME ZONE $2) ) 
     --           as urm  ON urm.child_id = rt.parent_id
      --  LEFT JOIN users usrm ON usrm.id = urm.parent_id

       ORDER BY ${tabname}.name
`,
    values: [req.body.historyDate || null, timezone],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("territory", result);
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
