import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
import { load } from "./load.js";

export async function update(req, res, tabname, timezone) {
  if (!req.body?.name || !req.body?.name.trim()) {
    return {
      error: "Не хватает данных. update",
    };
  }
  req.body.name = req.body.name.trim();

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      name = $2, franch = $3, trademark_id = $4, territory_id = $5,
      region_id = $6, city_id = $7, address = $8, dateopen = $9,
      dateclose = $10, area = $11, kolbakers = $12, ispack = $13, 
      own_kagent_id = $14, kagent_tm_id = $15, fr_kagent_id = $16, description = $17,
      user_id = $18, user_date = CURRENT_TIMESTAMP, meta = $19
      WHERE "id" = $1
      RETURNING id, name;

      `,
    values: [
      req.body?.id,
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

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
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
    console.log("Ошибка update ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
