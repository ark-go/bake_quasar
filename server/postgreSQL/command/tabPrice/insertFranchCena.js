import { pool } from "../../initPostgreSQL.js";
import { deleteFranchCena } from "./deleteFranchCena.js";
import { load } from "./load.js";

export async function insertFranchCena(req, res, tabname, timezone) {
  // price_id, price_bakery_id_array
  if (!req.body?.price_bakery_id_arr.length > 0) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (!req.body.cena) {
    return deleteFranchCena(req, res, tabname, timezone);
  }

  if (req.body?.id) {
    //   return updatePriceValue(req, res, tabname, timezone);
  }
  //price_bakery_franch
  let sqlP = {
    text: /*sql*/ `
      INSERT INTO price_bakery_franch (price_value_id, price_bakery_id, kagent_id, cena, description, meta, user_id)
      VALUES ($1, unnest($2::bigint[]), unnest($3::bigint[]), $4, $5, $6, $7)
      ON CONFLICT (price_value_id, price_bakery_id, kagent_id) DO 
      UPDATE SET
      price_value_id = EXCLUDED.price_value_id,
      price_bakery_id = EXCLUDED.price_bakery_id,
      kagent_id = EXCLUDED.kagent_id,
      cena = EXCLUDED.cena,
      description = EXCLUDED.description,
      meta = EXCLUDED.meta,
      user_id = EXCLUDED.user_id
      ;

      `,
    values: [
      req.body.price_value_id, //1
      req.body.price_bakery_id_arr, // 2
      req.body.kagent_id_arr, // 3
      req.body.cena, // 4
      req.body.description || "", // 5
      req.body.meta || {}, // 6
      req?.session?.user?.id || null, // 7
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
