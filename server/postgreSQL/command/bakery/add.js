import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { update } from "./update.js";
import { load } from "./load.js";
import escape from "pg-escape";

export async function add(req, res, tabname, timezone) {
  if (!req.body?.name || !req.body?.name.trim()) {
    return {
      error: "Не хватает данных. add",
    };
  }
  req.body.name = req.body.name.trim();

  if (req.body?.id) {
    return await update(req, res, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (
        name, franch, trademark_id, territory_id,
        region_id, city_id, address, dateopen,
        dateclose, area, kolbakers, ispack, 
        own_kagent_id, kagent_tm_id, fr_kagent_id, description,
        user_id, user_date, meta
      )
      VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,$12,
        $13,$14,$15,$16,
        $17,CURRENT_TIMESTAMP,$18)
      RETURNING id, name;

      `,
    values: [
      req.body?.name,
      req.body?.franch,
      req.body?.trademark_id,
      req.body?.territory_id,
      req.body?.region_id,
      req.body?.city_id,
      req.body?.address,
      req.body?.dateopen,
      req.body?.dateclose,
      req.body?.area,
      req.body?.kolbakers,
      req.body?.ispack,
      req.body?.own_kagent_id,
      req.body?.kagent_tm_id,
      req.body?.fr_kagent_id,
      req.body?.description,
      req?.session?.user?.id,
      req.body?.meta || {},
    ],
  };

  try {
    console.log("add bakery", sqlP);
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    //console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);

    if (result && result.length > 0) {
      return await load(req, res, tabname, timezone, result[0]?.id);
    }
    //! что делать, если не вставлена строка, и как тут может появиться
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
