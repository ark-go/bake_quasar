import { bakehousesAdd } from "../postgreSQL/command/bakehousesAdd.js";

export async function bakehousesPreAdd(req, res) {
  let data = req.body;

  if (!data.bakehouse) {
    return {
      error: "Нет пекарни!",
    };
  }
  if (await bakehousesAdd(data)) {
    return {
      message: "Пекарня " + data.bakehouse + " добавлена",
    };
  } else {
    return {
      error: "Ошибка добавления пекарни: " + data.bakehouse,
    };
  }
}
