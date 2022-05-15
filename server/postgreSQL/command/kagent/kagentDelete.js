import { pool } from "../../initPostgreSQL.js";

export async function kagentDelete(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    DELETE FROM kagent
      WHERE "id" = $1
    RETURNING id, name;
    `,
    values: [req.body.id],
  };

  try {
    let result = await pool.query(sqlP);
    console.log("CatalogAdd", result);
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      result: result.rowCount > 0 ? "Удалено." : "Удалено?",
    };
  } catch (err) {
    console.log(`Ошибка kagentDelete `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
