import { redisClient } from "../ioredisStore.js";
/**
 * Здесь на поданный ключ и его содержимое, производится изменения
 * добавляется флаг, который заставит пользователя, при следущем обращении
 * перечитать собственные данные, чтобы не заставлять его перелогиниваться
 *
 */

export async function changeUser(keyRedis, valueRedis) {
  let keyPrefix = redisClient.options.keyPrefix;
  valueRedis.user.isReloadUser = true; // устанавливаем ключ, для перезагрузки данных
  let newValue = JSON.stringify(valueRedis);
  let sessKey = keyRedis.replace(new RegExp("^" + keyPrefix), "");
  let ttl = await redisClient.ttl(sessKey);
  await redisClient.set(sessKey, newValue, "EX", ttl);
  console.log(
    "Redis установлен ключ перезагрузки данных для: ",
    valueRedis.user.email,
    valueRedis.user.id,
    sessKey
  );
  console.log(await redisClient.get(sessKey));
  return;
}
