import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function usersLoad() {
  let sqlP = {
    text: /*sql*/ `
    select email, username, u_fam,u_name,u_otch FROM users
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
    console.log("Ошибка чтения users", err.toString());
    return {
      error: err.toString(),
    };
  }
}
//console.log(await usersLoad());
