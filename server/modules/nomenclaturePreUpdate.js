import { nomenclatureUpdate } from "../postgreSQL/command/nomenclatureUpdate.js";
export async function nomenclaturePreUpdate(req, res) {
  let data = req.body;

  if (!data.nomenclature) {
    return {
      error: "Нет названия!",
    };
  }

  if (await nomenclatureUpdate(data)) {
    return {
      message: "Номенклатура сохранена: " + data.nomenclature,
    };
  } else {
    return {
      error: "Ошибка обновления номенклатуры: " + data.nomenclature,
    };
  }
}
