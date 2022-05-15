import { pool } from "../../initPostgreSQL.js";

export async function kagentUpdate(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  console.log("kagentAdd", JSON.stringify(req.body));

  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    UPDATE kagent SET
    name = $2,
    franchising = $3,
    owncompany = $4,
    inn = $5,
    vidreg_id = $6,
    meta = $7,
    user_id = $8,
    user_date = CURRENT_TIMESTAMP
WHERE "id" = $1
RETURNING id, name;
    `,
    values: [
      req.body.id,
      req.body.name && req.body.name.trim(),
      req.body.franchising,
      req.body.owncompany,
      req.body.inn && req.body.inn.trim(),
      req.body.vidreg_id,
      req.body.meta || {},
      userId,
    ],
  };

  try {
    let result = await pool.query(sqlP);
    //  console.log("CatalogAdd", result);
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      result: result.rowCount > 0 ? "Обновление." : "обновлено?",
    };
  } catch (err) {
    console.log(`Ошибка kagentUpdate `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
