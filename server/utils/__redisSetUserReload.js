import { redisClient } from "./ioredisStore.js";
// установить в сессию в редисе, признак перечитать настройки пользователя, который уде получил сессию
export async function redisSetUserReload() {
  // !---------- читаем ключи редиса ----------------------------------------------

  const getKeys = async (prefix = "") => {
    let finalKeyArray = [],
      keysArray = [];
    let stream = redisClient.scanStream({
      match: prefix,
    });
    return new Promise((res, rej) => {
      stream.on("data", async (keys = []) => {
        let key;
        for (key of keys) {
          if (!keysArray.includes(key)) {
            keysArray.push(key);
          }
        }
      });
      stream.on("end", () => {
        res(keysArray);
      });
    })
      .then((keysets) => {
        keysets.forEach((keySet) => {
          console.log("----", keySet);
          //   keySet.forEach((key) => {
          //     if (!finalKeyArray.includes(key)) {
          finalKeyArray.push(keySet);
          //     }
          //   });
        });
        return finalKeyArray;
      })
      .catch((err) => {
        console.error("Error while getting redis keys:", err);
        return [];
      });
  };
  let keyPrefix = redisClient.options.keyPrefix;
  // Запросим данные только сессий
  let arrOfKeys = await getKeys(keyPrefix + "sess:*");
  console.log("Нашли сессии", arrOfKeys);
  // ? --------------------------------------------------

  for (const item of arrOfKeys) {
    // console.log("item->>", item, "\n");
    let val = await redisClient.get(
      item.replace(new RegExp("^" + keyPrefix), "")
    );
    try {
      let f = JSON.parse(val);
      if (f?.user?.id) console.log(f?.user?.id, f?.user?.email);
    } catch {}
  }
  // !--------------------------------------------------------
  // получим текущий префикс
  //console.log("Prefix:", redisClient.options.keyPrefix);
  return;
}
