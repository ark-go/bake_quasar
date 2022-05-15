import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function update(req, res, tabname, timezone) {
  let name = req.body?.name ? req.body?.name.trim() : null;

  if (!req.body?.id || !name || !req.body?.brand_id) {
    return {
      error: "Не хватает данных.",
    };
  }

  let id = req.body.id;
  let brand_id = req.body.brand_id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
          name = $2,
          brand_id = $3,
          user_id = $4,
          user_date = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING id, name;

      `,
    values: [id, name, brand_id, req?.session?.user?.id],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    mess += "\n" + JSON.stringify(result);
    botSendMessage(mess, req);
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
