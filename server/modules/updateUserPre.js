import { updateUser } from "../postgreSQL/command/updateUser.js";
import { saltHashPassword } from "./passwordHash.js";
export async function updateUserPre(req, res) {
  let data = req.body;
  data.email = data.email.toLowerCase().trim();
  data.password = data.password.trim();

  if (!data.email) {
    return {
      error: "Нет email!",
    };
  }
  if (data.email == "admin@admin.tsg") {
    return {
      error: "Не надо меня редактировать !",
    };
  }
  if (data.password) {
    // Если указан пароль шифруем его
    data.password = saltHashPassword(data.password);
  }

  if (await updateUser(data)) {
    return {
      email: data.email,
      message: "Пользователь сохранен: " + data.email,
    };
  } else {
    return {
      error: "Ошибка обновления пользователя: " + data.email,
    };
  }
}
