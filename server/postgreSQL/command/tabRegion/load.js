import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - region
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,
     -- us.email as bakery_manager_name,
     -- terr.name as territory_name,
     -- ustm.email as territory_manager_name,
     -- reg.name as region_name,
     concat(usrm.u_fam,' ',substring(usrm.u_name,1,1),' ',substring(usrm.u_otch,1,1))  as region_manager_name,
    -- concat(usrm.u_fam,' ',usrm.u_name,' ',usrm.u_otch) as region_manager_name,
    -- usrm.email as region_manager_name,
    -- это было н 25-07-22
    --  NullIf( (select count(*) from territory_x_bakery 
    --  where parent_id = ANY (select child_id from region_x_territory where parent_id = ${tabname}.id AND is_last = true ) )
    --  ,0) as bakery_count,


    ---  NullIf( (select count(*) from region_x_territory where parent_id = ${tabname}.id AND is_last = true )
    ---  ,0) as territory_count
    ---  from ${tabname}

    -- по региону количество пекарен и по дате
    NullIf( (select count(*) from region_x_bakery_get_bakery_ondate(${tabname}.id, $1 AT TIME ZONE $2) )
      ,0) as bakery_count,


    -- выдадим все территории на дату
      NullIf( (select count(*) from region_x_territory_get_territory_ondate(${tabname}.id, $1 AT TIME ZONE $2) )
      ,0) as territory_count

      from ${tabname}
     -- LEFT JOIN LATERAL(select * from users_x_bakery_manager_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
     --         as ubm  ON ubm.child_id = ${tabname}.id
     -- LEFT JOIN users us ON us.id = ubm.parent_id
      --
     -- LEFT JOIN LATERAL(select * from territory_x_bakery_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
     --            as tb  ON tb.child_id = ${tabname}.id
     -- LEFT JOIN territory terr ON terr.id = tb.parent_id
       LEFT JOIN LATERAL(select * from users_x_region_manager_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
       as urm  ON urm.child_id = ${tabname}.id
       LEFT JOIN users usrm ON usrm.id = urm.parent_id
       --
      -- LEFT JOIN LATERAL(select * from users_x_territory_manager_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
      --         as utm  ON utm.child_id = ${tabname}.id
      -- LEFT JOIN users ustm ON ustm.id = utm.parent_id
       --
      -- LEFT JOIN LATERAL(select * from region_x_territory_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
      --           as rt  ON rt.child_id = ${tabname}.id
      -- LEFT JOIN region reg ON reg.id = rt.parent_id
       --
     -- (select count(*) from territory_x_bakery 
     --           where parent_id = ANY (select child_id from region_x_territory where parent_id = ${tabname}.id AND is_last = true ) )
                
                


       -- --
      -- LEFT JOIN (select * from users_x_territory_manager where  is_last = true ) 
      --           as utm  ON utm.parent_id = ${tabname}.id
      -- LEFT JOIN territory reg ON reg.id = utm.child_id
      ORDER BY ${tabname}.name
`,
    values: [req.body.historyDate || null, timezone],
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
