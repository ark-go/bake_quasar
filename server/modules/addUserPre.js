import { addUser } from "../postgreSQL/command/addUser.js";
import { saltHashPassword } from "./passwordHash.js";
export async function addUserPre(req, res) {
  let data = req.body;
  data.email = data.email.toLowerCase().trim();
  data.password = data.password.trim();

  if (!data.email || !data.password) {
    return {
      error: "Нет email или пароля!",
    };
  }

  data.password = saltHashPassword(data.password);

  if (await addUser(data)) {
    return {
      email: data.email,
      message: "Пользователь " + data.email + " обновлен",
    };
  } else {
    return {
      error: "Ошибка обновления пользователя: " + data.email,
    };
  }
}
