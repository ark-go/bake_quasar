import { partnersAdd } from "../postgreSQL/command/partnersAdd.js";

export async function partnersPreAdd(req, res) {
  let data = req.body;

  if (!data.partner) {
    return {
      error: "Нет названия контрагента!",
    };
  }
  if (await partnersAdd(data)) {
    return {
      message: "Контрагент " + data.partner + " добавлен",
    };
  } else {
    return {
      error: "Ошибка добавления контрагента: " + data.partner,
    };
  }
}
