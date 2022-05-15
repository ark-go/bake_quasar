// Записываем ингредиент к рецепту
// все ингредиенты хранятся в одной общей таблице

import { pool } from "../initPostgreSQL.js";

export async function ingredientDel(req, res) {
  let sqlP = "";
  console.log(req.body);
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let ingredId = req.body?.id;

  if (!ingredId) {
    return {
      error: "Не достаточно данных.",
    };
  }

  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  sqlP = {
    text: /*sql*/ `
    DELETE FROM ingredient
    WHERE id = $1;
    `,
    values: [ingredId],
  };

  try {
    let result = await pool.query(sqlP);

    console.log("ingredientsDel удалили.", ingredId);
    return {
      message:
        result.rowCount > 0 ? "Удален ингредиент" : "Не удален ингредиент",
    };
  } catch (err) {
    console.log(`Ошибка ingredientsDel `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
