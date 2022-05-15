import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function update2FA(id, fa2code) {
  let sqlP = {
    text: /*sql*/ `
    UPDATE users SET 
    "fa2code" = $1
    WHERE "id" = $2;
`,
    values: [fa2code, id],
  };

  try {
    let res = await pool.query(sqlP);
    // console.log("Update FA2", res);
    return true;
  } catch (err) {
    console.log("Ошибка обновления QRcode", err);
    return false;
  }
}

export async function delete2FA(id) {
  let sqlP = {
    text: /*sql*/ `
    UPDATE users SET 
    "fa2code" = ''
    WHERE "id" = $1;
`,
    values: [id],
  };

  try {
    let res = await pool.query(sqlP);
    console.log("Delete FA2", res);
    return true;
  } catch (err) {
    console.log("Ошибка удаления QRcode", err);
    return false;
  }
}
