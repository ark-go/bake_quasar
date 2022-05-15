import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      ${tabname}.franch,
      ${tabname}.trademark_id,
      trademark.name AS trdemark_name,
      ${tabname}.territory_id,
      territory.name AS territory_name,
      ${tabname}.branch_id,
      branch.name AS branch_name,
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

      --${tabname}.tm_kagent_id,         -- new kagent_tm_id   торговые сети
      --tmkagent.name AS tm_kagent_name, --  торговые сети
      --
      ${tabname}.kagent_tm_id,          -- ID из списка trademark/kagent Торговые сети
      tmkagent.name AS tm_kagent_name, -- Имя контрагента Торогоые сети
      tmkagent.id AS tm_kagent_id,     -- не нужно? ID контрагента  Торговые сети
      --
      ${tabname}.fr_kagent_id,
      frkagent.name AS fr_kagent_name,
      ${tabname}.description,
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  trademark ON trademark.id = ${tabname}.trademark_id
       LEFT JOIN  kagent_tm ON kagent_tm.id = ${tabname}.kagent_tm_id  -- здесь только id kagenta
      LEFT JOIN  territory ON territory.id = ${tabname}.territory_id
      LEFT JOIN  branch ON branch.id = ${tabname}.branch_id
      LEFT JOIN  city ON city.id = ${tabname}.city_id
        LEFT JOIN kagent AS tmkagent ON tmkagent.id = kagent_tm.kagent_id 
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
