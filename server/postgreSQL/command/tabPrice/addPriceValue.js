import { pool } from "../../initPostgreSQL.js";
import { updatePriceValue } from "./updatePriceValue.js";
import { load } from "./load.js";

export async function addPriceValue(req, res, tabname, timezone) {
  if (!req.body?.price_id) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (req.body?.id) {
    return updatePriceValue(req, res, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO price_value (price_id,article,price_name,productvid_id,cena,description, meta, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)

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
