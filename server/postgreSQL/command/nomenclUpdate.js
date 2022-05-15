import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function nomenclUpdate(req, res) {
  let id = req.body?.nomencl_id;
  //console.log("id", id, req.body.vidnomencl_id);
  if (!id || id == "0") {
    return {
      error: "Нет ошибка обновления номенклатуры нет ID.",
    };
  }
  let name = req.body.nomencl_name;
  if (!name) {
    return {
      error: "Нет названия.",
    };
  }
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  if (
    !req.body.nomencl_id ||
    !req.body.nomencl_name ||
    !req.body.vidnomencl_id ||
    !req.body.unit_id
  ) {
    return {
      error: "Не заполнено одно или несколько полей.",
    };
  }
  let sqlP = "";

  sqlP = {
    text: /*sql*/ `
    UPDATE nomencl SET 
    "name" = $2, 
    vidnomencl_id = $3, 
    unit_id = $4, 
    groupraw_id = $5, 
    vidraw_id = $6, 
    user_id = $7, 
    user_date = CURRENT_TIMESTAMP -- at time zone $8
 
    WHERE "id" = $1;
`,
    values: [
      id,
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
    let res1 = await pool.query(sqlP); //! TODO: Проверять результат !!
    console.log("Update nomenclature");
    return {
      message: "Обновили номенклатуру: " + req.body.nomencl_name,
    };
  } catch (err) {
    return {
      error: "Ошибка обновления номенклатуры: " + err?.message,
    };
  }
}
