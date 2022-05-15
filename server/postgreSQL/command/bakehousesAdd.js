import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function bakehousesAdd(data) {
  if (!data.bakehouse) {
    console.log("Ошибка добавления пекарни нет пекарни");
    return false;
  }
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO bakehouses (bakehouse, region, territory, own, city,brandname,distributing,admin_id)
    VALUES ($1, $2, $3, $4, $5,$6,$7,$8);
`,
    values: [
      data.bakehouse,
      data.region,
      data.territory,
      data.own,
      data.city,
      data.brandname,
      data.distributing,
      data.administering_id,
    ],
  };

  // let sqlP = /*sql*/ `
  // START TRANSACTION READ WRITE;
  //  select * from treedoc_nodeInsertRoot(${parseInt(userId)},'${JSON.stringify(
  //   permiss
  // )}':: jsonb,'${name}');
  // COMMIT;
  // `;

  try {
    let res = await pool.query(sqlP);
    console.log("Add bakehouses");
    return true;
  } catch (err) {
    console.log("Ошибка добавления Пекарни", err);
    return false;
  }
}
