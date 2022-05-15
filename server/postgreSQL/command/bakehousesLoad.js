import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function bakehousesLoad() {
  let sqlP = {
    text: /*sql*/ `
    select b.*, u.id as administering_id, u.email as administering FROM bakehouses as b
    LEFT JOIN users as u ON b.admin_id = u.id   -- INNER
`,
    values: [],
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;

    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения bakehouses", err.toString());
    return {
      error: err.toString(),
    };
  }
}
//console.log(await usersLoad());
