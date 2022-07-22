import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function updateActiveUser(id, active) {
  //return true;
  let sqlP = {
    text: /*sql*/ `
    UPDATE users SET 
    active = $2
    WHERE "id" = $1;
`,
    values: [id, active],
  };

  try {
    let res = await pool.query(sqlP);
    console.log("Update ActiveUser");

    return true;
  } catch (err) {
    console.log("Ошибка обновления ActiveUser", err);
    return false;
  }
}
