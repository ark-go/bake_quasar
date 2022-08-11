import { pool } from "../../initPostgreSQL.js";
import { updatePriceValue } from "./updatePriceValue.js";
import { load } from "./load.js";

export async function deleteFranchCena(req, res, tabname, timezone) {
  // price_id, price_bakery_id_array
  if (!req.body?.price_bakery_id_arr > 0) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (req.body?.id) {
    //   return updatePriceValue(req, res, tabname, timezone);
  }
  //price_bakery_franch
  let sqlP = {
    text: /*sql*/ `
      delete from price_bakery_franch
      where price_value_id = $1 AND price_bakery_id = ANY($2::bigint[])
    --  where price_value_id = $1 AND price_bakery_id = $2 AND kagent_id = $3
      
      `,
    values: [
      req.body.price_value_id, //1
      req.body.price_bakery_id_arr, // 2
      //  req.body.kagent_id, // 3
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
