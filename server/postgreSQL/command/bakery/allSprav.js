import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function allSprav(req, res, timezone) {
  let trademark = {
    text: /*sql*/ `
      SELECT
      id,
      name
      FROM trademark
      ORDER BY name
`,
  };
  let territory = {
    text: /*sql*/ `
      SELECT
      id,
      name
      FROM territory
      ORDER BY name
`,
  };
  let region = {
    text: /*sql*/ `
      SELECT
      id,
      name
      FROM region
      ORDER BY name
`,
  };
  let city = {
    text: /*sql*/ `
      SELECT
      city.id,
      city.name || ' (' || region_kl.name || ')' AS name
      FROM city
      LEFT JOIN  region_kl ON region_kl.id = city.region_id
      ORDER BY city.name
`,
  };
  //  TODO: Переделывать тригеры !!! на проверку Meta
  let kagent = {
    text: /*sql*/ `
      SELECT
      id,
      name,
      franchising,
      owncompany
      FROM kagent
      -- если нет поля, или в этом поле не true
      WHERE meta ->> 'system_select' IS NULL OR NOT meta ->> 'system_select' = 'true'
      ORDER BY name
`,
  };
  //   let nofranchkagent = {
  //     text: /*sql*/ `
  //       SELECT
  //       id,
  //       name,
  //       franchising,
  //       owncompany
  //       FROM kagent
  //       -- если нет поля, или в этом поле не true
  //       WHERE (meta ->> 'system_select' IS NULL OR NOT meta ->> 'system_select' = 'true')
  //       AND franchisng = TRUE
  //       ORDER BY name
  // `,
  //   };
  let allSprav = {};
  try {
    // let result = await pool.query(nofranchkagent);
    // result = result.rowCount > 0 ? result.rows : null;
    // allSprav.nofranchkagent = result;

    let result = await pool.query(trademark);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.trademark = result;

    result = await pool.query(territory);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.territory = result;

    result = await pool.query(region);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.region = result;

    result = await pool.query(city);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.city = result;

    result = await pool.query(kagent);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.kagent = result;

    //botSendMessage("Запрос справочников для Пекарни", req);
    return {
      result: allSprav,
    };
  } catch (err) {
    console.log("Ошибка чтения справочников для пекарни: ", err.toString());
    return {
      error: err.toString(),
    };
  }
}
