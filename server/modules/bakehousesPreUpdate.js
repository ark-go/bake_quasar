import { bakehousesUpdate } from "../postgreSQL/command/bakehousesUpdate.js";
export async function bakehousesPreUpdate(req, res) {
  let data = req.body;

  if (!data.bakehouse) {
    return {
      error: "Нет пекарни!",
    };
  }

  if (await bakehousesUpdate(data)) {
    return {
      message: "Пекарня сохранена: " + data.bakehouse,
    };
  } else {
    return {
      error: "Ошибка обновления пекарни: " + data.bakehouse,
    };
  }
}
