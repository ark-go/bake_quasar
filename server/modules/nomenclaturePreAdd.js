import { nomenclatureAdd } from "../postgreSQL/command/nomenclatureAdd.js";

export async function nomenclaturePreAdd(req, res) {
  let data = req.body;

  if (!data.nomenclature) {
    return {
      error: "Нет названия номенклатуры!",
    };
  }
  if (await nomenclatureAdd(data)) {
    return {
      message: "Номенклатура " + data.nomenclature + " добавлена",
    };
  } else {
    return {
      error: "Ошибка добавления номенклатура: " + data.nomenclature,
    };
  }
}
