import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.territory_id ? "WHERE " +  tabname + ".territory_id = $2" : "";
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
      ${tabname}.name,
      ${tabname}.franch,
     -- ${dateend}
      to_char(${tabname}.dateopen,  'DD.MM.YYYY') as date_start, to_char(${tabname}.dateclose,  'DD.MM.YYYY') as date_end,
     -- ${tabname}.trademark_id,
     -- trademark.name AS trdemark_name,
     trademark_g.name as trademark_name,

      ${tabname}.territory_id,
      -- territory.name AS territory_name,
      territory_g.name AS territory_name,
     -- territory_g.name AS territory_g_name,   -- !!!!!!!!!
      ${tabname}.region_id,
      --region.name AS region_name,
      region_g.name as region_name,
      ${tabname}.city_id,
      city.name AS city_name,
      ${tabname}.address,
      -- ${tabname}.dateopen,
      to_char(${tabname}.dateopen at time zone $1,  'DD.MM.YYYY') as "dateopen",
      -- ${tabname}.dateclose,
      to_char(${tabname}.dateclose at time zone $1,  'DD.MM.YYYY') as "dateclose",
      ${tabname}.area,       -- площадь
      ${tabname}.kolbakers,  -- кол-во пекарей
      ${tabname}.ispack,     -- есть упаковка
      ${tabname}.own_kagent_id,
      ownkagent.name AS own_kagent_name,
      --
     -- ${tabname}.kagent_tm_id,          -- ID из списка trademark/kagent Торговые сети
     -- tmkagent.name AS tm_kagent_name, -- Имя контрагента Торогоые сети
     -- tmkagent.id AS tm_kagent_id,     -- не нужно? ID контрагента  Торговые сети
     kagent_g.name as tm_kagent_name,
      --
      ${tabname}.fr_kagent_id,
      frkagent.name AS fr_kagent_name,
      ${tabname}.description,
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      -- LEFT JOIN  trademark ON trademark.id = ${tabname}.trademark_id
      -- LEFT JOIN  kagent_tm ON kagent_tm.id = ${tabname}.kagent_tm_id  -- здесь только id kagenta
      -- Территория
      LEFT JOIN LATERAL(select * from territory_x_bakery_get_last(${tabname}.id) ) 
      as tb  ON tb.child_id = ${tabname}.id
      LEFT JOIN territory territory_g ON territory_g.id = tb.parent_id
      -- Регион
      LEFT JOIN LATERAL(select * from region_x_territory_get_last(territory_g.id) ) 
      as rt  ON rt.child_id = territory_g.id
       LEFT JOIN region region_g ON region_g.id = rt.parent_id
      -- Торговая сеть
      LEFT JOIN LATERAL(select * from trademark_x_bakery_get_last(${tabname}.id) ) 
      as tdm  ON tdm.child_id = ${tabname}.id
      LEFT JOIN trademark trademark_g ON trademark_g.id = tdm.parent_id
      -- Контрагент сети
      LEFT JOIN LATERAL(select * from kagent_x_bakery_get_last(${tabname}.id) ) 
      as kb  ON kb.child_id = ${tabname}.id
      LEFT JOIN kagent kagent_g ON kagent_g.id = kb.parent_id
      --



         -- LEFT JOIN  ( select * from territory_bakery 
         --           where  is_last = true ) as bt  ON bt.bakery_id = ${tabname}.id
         -- LEFT JOIN  territory as territory_g ON territory_g.id = bt.territory_id

         --    LEFT JOIN  ( select * from region_x_territory 
         --       where  is_last = true ) as tr  ON tr.child_id = territory_g.id
         --    LEFT JOIN  region as region_g ON region_g.id = tr.parent_id


      LEFT JOIN  city ON city.id = ${tabname}.city_id
     -- LEFT JOIN kagent AS tmkagent ON tmkagent.id = kagent_tm.kagent_id 
      LEFT JOIN  kagent AS ownkagent ON ownkagent.id = ${tabname}.own_kagent_id
      --LEFT JOIN  kagent AS tmkagent ON tmkagent.id = ${tabname}.tm_kagent_id
      LEFT JOIN  kagent AS frkagent ON frkagent.id = ${tabname}.fr_kagent_id
      ${wher}
      ORDER BY ${tabname}.name
`,
    values: [timezone],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //console.log("wher", sqlP);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    // console.log("bakery", result);
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
