import { redisClient } from "../ioredisStore.js";
import { getAllKeys } from "./getAllKeys.js";
import { changeUser } from "./changeUser.js";
/**
 * установить в сессию в редисе, признак перечитать настройки пользователя, который уде получил сессию
 * idUser  может быть 'all'
 *
 *
 */
export async function redisSetUserReload(idUser) {
  // !---------- читаем ключи редиса ----------------------------------------------
  // получим общий префикс, установленный приложением для Redis
  let keyPrefix = redisClient.options.keyPrefix;
  // Запросим данные только сессий
  let arrOfKeys = await getAllKeys(keyPrefix + "sess:*");
  // console.log("Нашли сессии", arrOfKeys);
  // ? --------------------------------------------------

  for (const item of arrOfKeys) {
    // console.log("item->>", item, "\n");
    let val = await redisClient.get(
      item.replace(new RegExp("^" + keyPrefix), "")
    );
    try {
      let value = JSON.parse(val);
      // если получилось, преобразовать в json
      if (idUser) {
        // был параметр, если в нем есть user id, отправим на обработку
        // существуют значения без user
        if (value?.user?.id && idUser == "all") {
          // меняем всем кого найдем
          await changeUser(item, value); // отдадим на обработку
          continue;
        }
        if (value?.user?.id && value?.user?.id == idUser) {
          // если задали определенный ID
          await changeUser(item, value); // отдадим на обработку
          continue;
        }
      } else {
        // без параметра, просто выводим всех.
        console.log(value?.user?.id, value?.user?.email, item);
      }
    } catch {}
  }
  // !--------------------------------------------------------
  // получим текущий префикс
  //console.log("Prefix:", redisClient.options.keyPrefix);
  return;
}
