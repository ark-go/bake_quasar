import { pool } from "../initPostgreSQL.js";

export async function catalogDelete(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let newValue = req.body?.newValue;
  let tableName = req.body?.tableName;
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    UPDATE ${tableName} SET 
    "user_id" = $2,
    "deleted" = $3,
    "meta" = $4::jsonb
    WHERE "id" = $1;
    `,
    values: [newValue, userId, true, {}],
  };

  try {
    let result = await pool.query(sqlP);
    return {
      message: result.rowCount > 0 ? "Удалено." : "удалено?",
    };
  } catch (err) {
    console.log(`Ошибка catalogDelete ${tableName}`, err.toString());
    return {
      error: err.toString(),
    };
  }
}
