import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function bakehousesUpdate(data) {
  console.log("Пекарня update: ", data);
  if (!data.bakehouse) {
    console.log("Ошибка обновления Пекарни нет пекарни");
    return false;
  }
  let sqlP = "";

  sqlP = {
    text: /*sql*/ `
    UPDATE bakehouses SET 
    bakehouse = $1,
    region = $2,
    territory = $3,
    own = $4,
    city =$5,
    brandname =$6,
    distributing =$7,
    admin_id =$8
    WHERE "bakehouse" = $1;
`,
    values: [
      data.bakehouse,
      data.region,
      data.territory,
      data.own,
      data.city,
      data.brandname,
      data.distributing,
      data.administering_id, //data.administering,
    ],
  };

  try {
    let res = await pool.query(sqlP);
    console.log("Update bakehouses");
    return true;
  } catch (err) {
    console.log("Ошибка обновления Пекарни", err);
    return false;
  }
}
