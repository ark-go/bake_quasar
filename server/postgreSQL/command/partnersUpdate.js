import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function partnersUpdate(data) {
  if (!data.partner) {
    console.log("Ошибка обновления контрагента нет контрагента");
    return false;
  }
  let sqlP = "";

  sqlP = {
    text: /*sql*/ `
    UPDATE partners SET 
    partner = $1,
    typepartner = $2,
    typeregistracion = $3,
    grouppartner = $4
    WHERE "partner" = $1;
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
    console.log("Update partners");
    return true;
  } catch (err) {
    console.log("Ошибка обновления partners", err);
    return false;
  }
}
