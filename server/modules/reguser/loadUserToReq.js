import { pool } from "../../postgreSQL/initPostgreSQL.js";
/**
 * загружаем данные пользователя,
 * @param {*} req или подаем req в котором (req.session.user.id) или ID юзера ну или null
 * @param {*} email  либо подаем email, или пропускаем
 * @returns
 */
export async function loadUserToReq(req, email) {
  let idUser = "";
  if (req && typeof req == "object") {
    // это объект и не null
    idUser = req?.session?.user?.id;
  } else if (typeof req == "number") {
    idUser = req;
  } else {
    idUser = null;
  }
  let sqlP = {
    // Возможно тут  будут ошибки, три строки были раньше
    // надо выяснить что требовалось для сессии
    // а что требуется для логина.
    text: `
         SELECT 
           users.*, 
           concat(users.u_fam,' ', users.u_name,' ', users.u_otch) as fio,
           users_login.password AS password,
           users_login.fa2code AS fa2code,
           users_login.status AS status
         from users 
         left join users_login on users_login.email = users.email
         -- where users.email = $1
            `,
  };
  if (idUser) {
    sqlP.text += " " + "where users.id = $1";
    sqlP.values = [idUser];
  } else if (email) {
    sqlP.text += " " + "where users.email = $1";
    sqlP.values = [email];
  } else {
    console.log("Ошибка загрузки пользователя, не указаны данные");
    return null;
  }

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows[0] : null; // берем саму строку
    if (result) {
      result.roles = [...new Set([...result.roles, ...["USER"]])];
      console.log("Загрузка пользователя", result.email);
    }
    return result;
  } catch (err) {
    console.log("Ошибка загрузки пользователя", idUser || email);
    return null;
  }
}
