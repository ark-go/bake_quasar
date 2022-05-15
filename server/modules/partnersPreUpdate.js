import { partnersUpdate } from "../postgreSQL/command/partnersUpdate.js";
export async function partnersPreUpdate(req, res) {
  let data = req.body;

  if (!data.partner) {
    return {
      error: "Нет названия!",
    };
  }

  if (await partnersUpdate(data)) {
    return {
      message: "Контрагент сохранен: " + data.partner,
    };
  } else {
    return {
      error: "Ошибка обновления контрагента: " + data.partner,
    };
  }
}
