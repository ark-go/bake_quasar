import Redis from "ioredis";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { redisClient } from "../utils/ioredisStore.js";
const { name } = require("../package.json");
import dotenv from "dotenv";
dotenv.config();
export let redisClientIoSocket = null;
//console.log("Environment", process.env);
console.log("Проверка редис MSK", process.env.RedisMSK, process.env.Redis_port);
if (process.env.RedisMSK) {
  try {
    redisClientIoSocket = new Redis({
      autoResendUnfulfilledCommands: false, // отключить завершать отправку после обрыва
      // enableOfflineQueue: false, // false - не отправлять,не повторять, команду , если не получилось сразу
      reconnectOnError(err) {
        console.log("redis 10.9.0.1", err);
        return true;
      },
      maxRetriesPerRequest: null, // все ожидающие команды будут сбрасываться, кол-во попыток до выброса ошибки - null ждать вечно
      showFriendlyErrorStack: false, // только для отладки.. для вывода нормальных ошибок
      // keyPrefix: process.env.Redis_prefix
      //   ? process.env.Redis_prefix + ":"
      //   : name + ":",
      port: process.env.Redis_port, // Redis port
      host: process.env.RedisMSK, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: process.env.Redis_password,
      db: process.env.Redis_db,
    });
    redisClientIoSocket.on("error", function (err) {
      if (err?.code != "EHOSTUNREACH") {
        console.log("redis error::", err?.address + "!");
      }
    });
    redisClientIoSocket.on("connect", function () {
      console.info("Redis external Подключился");
    });

    redisClientIoSocket.on("ready", function () {
      let mess = process.env.RedisMSK ? "Moscow" : "Local";
      console.info("Redis external Готов");
    });
  } catch (err) {
    console.log("Ошибка Redis 771", err);
  }
} else {
  redisClientIoSocket = redisClient;
  // redisClientIoSocket = new Redis({
  //   //showFriendlyErrorStack: true, // только для отладки.. для вывода нормальных ошибок
  //   // keyPrefix: process.env.Redis_prefix
  //   //   ? process.env.Redis_prefix + ":"
  //   //   : name + ":",
  //   port: process.env.Redis_port, // Redis port
  //   host: process.env.Redis_host, // Redis host
  //   family: 4, // 4 (IPv4) or 6 (IPv6)
  //   password: process.env.Redis_password,
  //   db: process.env.Redis_db,
  // });
}
