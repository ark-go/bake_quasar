import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
// будем получать печки, которые есть у сети и контрагента и только у своего контра
// для модального окна
export async function loadBakeryTrademarkKagent(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  //! table - Trademark
  let sqlP = {
    text: /*sql*/ `
    select 
    bakery.id as id,
    bakery.name as name,
    bakery.address as address,
    city.name as city_name,
      
    kg.name as kagent_name,
    kgown.name as kagent_own_name,
    kgfranch.name as kagent_franch_name,
    terr.name as territory_name,
    reg.name as region_name,
    trademark.name as trademark_name

      from (
        -- все печки собств. контрагента, у которых есть и контрагент
        select child_id from kagent_x_bakery_own_get_kagentown_ondate($1 AT TIME ZONE $2)
        where child_id = ANY(select child_id from trademark_x_bakery_get_trademark_ondate($1 AT TIME ZONE $2)
                              where parent_id = $3)
              AND parent_id = $5
              AND child_id = ANY (
                -- все печки контрагента, сети на дату
                select child_id from kagent_x_bakery_get_kagent_ondate($1 AT TIME ZONE $2)
                where child_id = ANY(select child_id from trademark_x_bakery_get_trademark_ondate($1 AT TIME ZONE $2)
                                      where parent_id = $3)
                     AND parent_id = $4
              )
          ) as bakown
      -- 
      LEFT JOIN bakery ON bakery.id = bakown.child_id 
      LEFT JOIN city ON city.id = bakery.city_id
          -- взято из tabBakery
      -- менеджер пекарни    
      LEFT JOIN LATERAL(select * from users_x_bakery_manager_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
              as ubm  ON ubm.child_id = bakown.child_id
      LEFT JOIN users us ON us.id = ubm.parent_id
      -- контрагент пекарни
      LEFT JOIN LATERAL(select * from kagent_x_bakery_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
              as kb  ON kb.child_id = bakown.child_id
      LEFT JOIN kagent kg ON kg.id = kb.parent_id
      -- собств контрагент
      LEFT JOIN LATERAL(select * from kagent_x_bakery_own_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
              as kbown  ON kbown.child_id = bakown.child_id
      LEFT JOIN kagent kgown ON kgown.id = kbown.parent_id
      -- франчайзи
      LEFT JOIN LATERAL(select * from kagent_x_bakery_franch_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
              as kbfr  ON kbfr.child_id = bakown.child_id
      LEFT JOIN kagent kgfranch ON kgfranch.id = kbfr.parent_id      
      -- территория
      LEFT JOIN LATERAL(select * from territory_x_bakery_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
                 as tb  ON tb.child_id = bakown.child_id
      LEFT JOIN territory terr ON terr.id = tb.parent_id
       -- менеджер терртории
      -- LEFT JOIN LATERAL(select * from users_x_territory_manager_get_last(terr.id,$1 AT TIME ZONE $2) ) 
      --         as utm  ON utm.child_id = terr.id
      -- LEFT JOIN users ustm ON ustm.id = utm.parent_id
       -- регион
       LEFT JOIN LATERAL(select * from region_x_territory_get_last(terr.id,$1 AT TIME ZONE $2) ) 
                 as rt  ON rt.child_id = terr.id
       LEFT JOIN region reg ON reg.id = rt.parent_id
       -- менеджер региона
      -- LEFT JOIN LATERAL(select * from users_x_region_manager_get_last(rt.parent_id,$1 AT TIME ZONE $2) ) 
      --         as urm  ON urm.child_id = rt.parent_id
      -- LEFT JOIN users usrm ON usrm.id = urm.parent_id
          --
      LEFT JOIN LATERAL(select * from trademark_x_bakery_get_last(bakown.child_id,$1 AT TIME ZONE $2) ) 
          as trdm  ON trdm.child_id = bakown.child_id
       LEFT JOIN trademark ON trademark.id = trdm.parent_id
       -- выбираем те печки которых нет в прайсе   вот фильтр ! +++++++++++++++++++++++++++++++++++++
       where NOT bakery.id = ANY (select bakery_id from price_bakery where price_id = $6)

`,
    values: [
      req.body.datestart, // 1
      timezone, // 2
      req.body.trademark_id, // 3
      req.body.kagent_id, // 4
      req.body.kagent_own_id, // 5
      req.body.price_id, // 6
    ],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("печкиии", result);
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
