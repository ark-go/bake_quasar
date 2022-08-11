import { pool } from "../../initPostgreSQL.js";
import { updateDocument } from "./updateDocument.js";
import { load } from "./load.js";

export async function updatePriceValue(req, res, tabname, timezone) {
  if (!req.body?.id) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (req.body?.id) {
    //  return updateDocument(req, res, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      UPDATE price_value SET 
      price_id = $1,
      article = $2,
      price_name = $3,
      productvid_id = $4,
      cena = $5,
      description = $6,
      meta = $7,
      user_id = $8
      where id = $9

      `,
    values: [
      req.body.price_id,
      req.body.article,
      req.body.price_name,
      req.body.productvid_id,
      req.body.cena,
      req.body.description || "",
      req.body.meta || {},
      req?.session?.user?.id || null,
      req.body.id,
    ],
  };

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    return {
      result: result.rowCount,
    };
  } catch (err) {
    console.log("Ошибка добавления ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
