import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function nomenclAdd(req, res) {
  req.body;
  // if (!data.nomencl_id > 0) {
  //   console.log("Ошибка добавления номенклатуры нет ID");
  //   return false;
  // }
  let name = req.body.nomencl_name;

  if (!name) {
    return {
      error: "Нет названия.",
    };
  }
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  if (!req.body.nomencl_name || !req.body.vidnomencl_id || !req.body.unit_id) {
    return {
      error: "Не заполнено одно или несколько полей.",
    };
  }

  let sqlP = {
    text: /*sql*/ `
    INSERT INTO nomencl ("name", vidnomencl_id, unit_id, groupraw_id, vidraw_id, user_id, user_date)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP);-- at time zone $7);
`,
    values: [
      req.body.nomencl_name,
      req.body.vidnomencl_id,
      req.body.unit_id,
      req.body.groupraw_id,
      req.body.vidraw_id,
      req?.session?.user?.id,
      //   timezone,
    ],
  };

  try {
    let res = await pool.query(sqlP);
    console.log("Add nomenclature");
    return {
      message: "Добавлено: " + req.body.nomencl_name,
    };
  } catch (err) {
    return {
      error: "Ошибка добавления номенклатуры: " + err?.message,
    };
  }
}
