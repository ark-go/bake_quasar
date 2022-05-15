import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function partnersAdd(data) {
  if (!data.partner) {
    console.log("Ошибка добавления контрагента нет контрагента");
    return false;
  }
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO partners (partner, typepartner, typeregistracion, grouppartner)
    VALUES ($1, $2, $3, $4);
`,
    values: [
      data.partner,
      data.typepartner,
      data.typeregistracion,
      data.grouppartner,
    ],
  };

  try {
    let res = await pool.query(sqlP);
    console.log("Add partners");
    return true;
  } catch (err) {
    console.log("Ошибка добавления контрагента", err);
    return false;
  }
}
