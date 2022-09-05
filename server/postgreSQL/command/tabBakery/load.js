import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - bakery
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name as name,
      kg.name as kagent_name,
      kgown.name as kagent_own_name,
      kgfranch.name as kagent_franch_name,
      concat(us.u_fam,' ',substring(us.u_name,1,1),' ',substring(us.u_otch,1,1))  as bakery_manager_name,
     -- concat(us.u_fam,' ',us.u_name,' ',us.u_otch) as bakery_manager_name,
    --  us.email as bakery_manager_name,
      terr.name as territory_name,
      concat(ustm.u_fam,' ',substring(ustm.u_name,1,1),' ',substring(ustm.u_otch,1,1))  as territory_manager_name,
   --  concat(ustm.u_fam,' ',ustm.u_name,' ',ustm.u_otch) as territory_manager_name,
    --  ustm.email as territory_manager_name,
      reg.name as region_name,
      concat(usrm.u_fam,' ',substring(usrm.u_name,1,1),' ',substring(usrm.u_otch,1,1))  as region_manager_name,
      trdm.name as trademark_name
    --  concat(usrm.u_fam,' ',usrm.u_name,' ',usrm.u_otch) as region_manager_name
    --  usrm.email as region_manager_name
    --  NullIf( (select count(*) from users_x_region_manager where parent_id = ${tabname}.id AND is_last = true ) 
    --   ,0) as region_count,
    --  NullIf( (select count(*) from users_x_territory_manager where parent_id = ${tabname}.id AND is_last = true )
    --  ,0) as territory_count,
    --  NullIf( (select count(*) from users_x_bakery_manager where parent_id = ${tabname}.id AND is_last = true )
    --  ,0) as bakery_count

      from ${tabname}
      
      LEFT JOIN LATERAL(select * from users_x_bakery_manager_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
              as ubm  ON ubm.child_id = ${tabname}.id
      LEFT JOIN users us ON us.id = ubm.parent_id

      LEFT JOIN LATERAL(select * from trademark_x_bakery_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
      as trdb  ON trdb.child_id = ${tabname}.id
     LEFT JOIN trademark trdm ON trdm.id = trdb.parent_id
      --
      LEFT JOIN LATERAL(select * from kagent_x_bakery_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
              as kb  ON kb.child_id = ${tabname}.id
      LEFT JOIN kagent kg ON kg.id = kb.parent_id
      --
      LEFT JOIN LATERAL(select * from kagent_x_bakery_own_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
              as kbown  ON kbown.child_id = ${tabname}.id
      LEFT JOIN kagent kgown ON kgown.id = kbown.parent_id
      --
      LEFT JOIN LATERAL(select * from kagent_x_bakery_franch_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
              as kbfr  ON kbfr.child_id = ${tabname}.id
      LEFT JOIN kagent kgfranch ON kgfranch.id = kbfr.parent_id      
      --
      LEFT JOIN LATERAL(select * from territory_x_bakery_get_last(${tabname}.id,$1 AT TIME ZONE $2) ) 
                 as tb  ON tb.child_id = ${tabname}.id
      LEFT JOIN territory terr ON terr.id = tb.parent_id
       --
       LEFT JOIN LATERAL(select * from users_x_territory_manager_get_last(terr.id,$1 AT TIME ZONE $2) ) 
               as utm  ON utm.child_id = terr.id
       LEFT JOIN users ustm ON ustm.id = utm.parent_id
       --
       LEFT JOIN LATERAL(select * from region_x_territory_get_last(terr.id,$1 AT TIME ZONE $2) ) 
                 as rt  ON rt.child_id = terr.id
       LEFT JOIN region reg ON reg.id = rt.parent_id
       --
       LEFT JOIN LATERAL(select * from users_x_region_manager_get_last(rt.parent_id,$1 AT TIME ZONE $2) ) 
               as urm  ON urm.child_id = rt.parent_id
       LEFT JOIN users usrm ON usrm.id = urm.parent_id
     

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
