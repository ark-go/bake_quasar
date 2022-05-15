// Записываем ингредиент к рецепту
// все ингредиенты хранятся в одной общей таблице

import { pool } from "../initPostgreSQL.js";

export async function ingredientsAdd(req, res) {
  let sqlP = "";
  console.log(req.body);
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let receptId = req.body?.recept_id;
  let receptIdx = req.body?.recept_idx;
  let nomenclId = req.body?.nomencl_id;
  let brutto = req.body?.brutto;
  let netto = req.body?.netto;
  let itogo = req.body?.vixod;
  let comment = req.body?.comment;
  let user_id = req?.session?.user?.id;
  let meta = req.body?.meta;
  if (!receptId) {
    return {
      error: "Не достаточно данных.",
    };
  }

  meta = meta ? meta : {};
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  sqlP = {
    text: /*sql*/ `
    INSERT INTO ingredient(recept_id,nomencl_id,recept_idx,netto,brutto,itogo,comment,user_id,user_date,meta) 
    VALUES ($1, $2, $3, $4,$5,$6,$7,$8,CURRENT_TIMESTAMP,$9);
    `,
    values: [
      receptId,
      nomenclId,
      receptIdx,
      netto,
      brutto,
      itogo,
      comment,
      user_id,
      meta,
    ],
  };

  try {
    let result = await pool.query(sqlP);

    console.log("ingredientsAdd добавилось.");
    return {
      message:
        result.rowCount > 0 ? "Добавлен ингредиент" : "Не добавлен ингредиент",
    };
  } catch (err) {
    console.log(`Ошибка ingredientsAdd `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
