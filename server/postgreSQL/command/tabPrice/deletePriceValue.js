import { pool } from "../../initPostgreSQL.js";
import { updateDocument } from "./updateDocument.js";
import { load } from "./load.js";

export async function deletePriceValue(req, res, tabname, timezone) {
  if (!req.body?.price_id) {
    return {
      error: "Не хватает данных.",
    };
  }

  let sqlP = {
    text: /*sql*/ `
      DELETE FROM price_value
      where id = $1

      `,
    values: [req.body.price_id],
  };

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    return {
      result: result.rowCount,
    };
  } catch (err) {
    console.log("Ошибка Удаления  price", err.toString());
    return {
      error: err.toString(),
    };
  }
}
