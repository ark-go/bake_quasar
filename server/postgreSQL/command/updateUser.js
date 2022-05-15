import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function updateUser(data) {
  if (!data.email) {
    console.log("Ошибка обновления Пользовеля нет email");
    return false;
  }
  let sqlP = "";
  if (data.password) {
    sqlP = {
      text: /*sql*/ `
    UPDATE users SET 
    password = $2,
    username = $3,
    u_fam = $4,
    u_name = $5,
    u_otch =$6
    WHERE "email" = $1;
`,
      values: [
        data.email,
        data.password,
        data.username,
        data.u_fam,
        data.u_name,
        data.u_otch,
      ],
    };
  } else {
    // -----------------------------------------------------------
    sqlP = {
      text: /*sql*/ `
UPDATE users SET 
username = $2,
u_fam = $3,
u_name = $4,
u_otch =$5
WHERE "email" = $1;
`,
      values: [data.email, data.username, data.u_fam, data.u_name, data.u_otch],
    };
  }

  // let sqlP = /*sql*/ `
  // START TRANSACTION READ WRITE;
  //  select * from treedoc_nodeInsertRoot(${parseInt(userId)},'${JSON.stringify(
  //   permiss
  // )}':: jsonb,'${name}');
  // COMMIT;
  // `;

  try {
    let res = await pool.query(sqlP);
    console.log("Update Users");
    return true;
  } catch (err) {
    console.log("Ошибка обновления Пользовеля", err);
    return false;
  }
}
