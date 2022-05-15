import { pool } from "../initPostgreSQL.js";

// обновляем заменяем код 2FA для пользователя
export async function nomenclDelete(req, res) {
  let id = req.body?.nomencl_id;
  //console.log("id", id, req.body.vidnomencl_id);
  if (!id || id == "0") {
    return {
      error: "Нет ошибка обновления номенклатуры нет ID.",
    };
  }
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  if (req.body.nomencl_id.trim() == "0") {
    return {
      error: "Не заполнено одно или несколько полей.",
    };
  }
  let sqlP = "";

  sqlP = {
    text: /*sql*/ `
    UPDATE nomencl SET 
    "deleted" = TRUE, 
    user_id = $2, 
    user_date = CURRENT_TIMESTAMP -- at time zone $8
 
    WHERE "id" = $1;
`,
    values: [
      id,
      req?.session?.user?.id,
      //   timezone,
    ],
  };

  try {
    let res1 = await pool.query(sqlP); //! TODO: Проверять результат !!
    console.log("Update-delete nomenclature");
    return {
      message: "Удалили номенклатуру: " + req.body.nomencl_id,
    };
  } catch (err) {
    return {
      error: "Ошибка удаления номенклатуры: " + err?.message,
    };
  }
}
