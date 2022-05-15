import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function addUser(data) {
  if (!data.email || !data.password) {
    console.log("Ошибка добавления Пользовеля нет email или password");
    return false;
  }
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO users (email, password, username, u_fam, u_name,u_otch)
    VALUES ($1, $2, $3, $4, $5,$6);
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

  // let sqlP = /*sql*/ `
  // START TRANSACTION READ WRITE;
  //  select * from treedoc_nodeInsertRoot(${parseInt(userId)},'${JSON.stringify(
  //   permiss
  // )}':: jsonb,'${name}');
  // COMMIT;
  // `;

  try {
    let res = await pool.query(sqlP);
    console.log("Add Users");
    return true;
  } catch (err) {
    console.log("Ошибка добавления Пользовеля", err);
    return false;
  }
}
