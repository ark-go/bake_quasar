import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";

  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";
  //  console.log(">>>>>>> ", req.body.treeId); // allUsers
  // для загрузки только группы печек
  // table - users
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      concat(${tabname}.u_fam,' ',substring(${tabname}.u_name,1,1),' ',substring(${tabname}.u_otch,1,1))  as name,
     -- concat(${tabname}.u_fam,' ',${tabname}.u_name,' ',${tabname}.u_otch) as name,
      ${tabname}.email as email,
      ${tabname}.u_name as user_name,
      ${tabname}.u_fam as user_fam,
      ${tabname}.u_otch as user_otch,
      ${tabname}.rereg as rereg,
      ${tabname}.description as description,
      ulogin.status as status,
      CASE WHEN ulogin.email IS NULL THEN
         false
          ELSE
         true
      END AS islogin,

      NullIf( (select count(*) from users_x_region_manager_get_region_ondate(${tabname}.id, $4 AT TIME ZONE $5) )
      ,0) as region_count,

    --  NullIf( (select count(*) from users_x_region_manager where parent_id = ${tabname}.id AND is_last = true ) 
    --   ,0) as region_count,
       
       NullIf( (select count(*) from users_x_territory_manager_get_territory_ondate(${tabname}.id, $4 AT TIME ZONE $5) )
       ,0) as territory_count,

     -- NullIf( (select count(*) from users_x_territory_manager where parent_id = ${tabname}.id AND is_last = true )
     -- ,0) as territory_count,
     NullIf( (select count(*) from users_x_bakery_manager_get_bakery_ondate(${tabname}.id, $4 AT TIME ZONE $5) )
     ,0) as bakery_count
   --  NullIf( (select count(*) from users_x_bakery_manager where parent_id = ${tabname}.id AND is_last = true )
   --   ,0) as bakery_count

      from ${tabname}
      LEFT JOIN users_login as ulogin  ON ulogin.email = ${tabname}.email
      
      -- LEFT JOIN (select * from users_x_region_manager where  is_last = true ) 
      --           as urm  ON urm.parent_id = ${tabname}.id
      -- LEFT JOIN region reg ON reg.id = urm.child_id
      -- --
      -- LEFT JOIN (select * from users_x_territory_manager where  is_last = true ) 
      --           as utm  ON utm.parent_id = ${tabname}.id
      -- LEFT JOIN territory reg ON reg.id = utm.child_id
      where   
        -- allUsers не просят выбираем по id
        ($2::boolean = false AND $3::boolean = false AND users.tree_id = $1)
        OR 
        ($2::boolean = false AND $3::boolean = true AND ulogin.status = 'WaitManualConfirm' )
        OR
        ($2::boolean = true)

      --case when $2::boolean = false then
      --users.tree_id = $1
      --else users.id > 0 end
      



      ORDER BY name
`,
    values: [
      req.body.treeId || null, // 1
      req.body.allUsers || false, // 2
      req.body.waitConfirm || false, // 3
      req.body.historyDate || null, // 4
      timezone, // 5
    ],
  };
  // if (idOne) sqlP.values = [timezone, idOne];
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
