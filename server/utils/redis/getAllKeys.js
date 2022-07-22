import { redisClient } from "../ioredisStore.js";
/**
 * Получаем все ключи, по префиксу,
 *
 */
export async function getAllKeys(prefix) {
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
        // console.log("----", keySet); // Здесь выведуться все ключи
        finalKeyArray.push(keySet);
      });
      return finalKeyArray;
    })
    .catch((err) => {
      console.error("Error while getting redis keys:", err);
      return [];
    });
}
