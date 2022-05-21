import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name } = require("../package.json");

export const redisStore = connectRedis(session);
export const redisClient = new Redis({
  //showFriendlyErrorStack: true, // только для отладки.. для вывода нормальных ошибок
  keyPrefix: process.env.Redis_prefix
    ? process.env.Redis_prefix + ":"
    : name + ":",
  port: process.env.Redis_port, // Redis port
  host: process.env.Redis_host, // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.Redis_password,
  db: process.env.Redis_db,
});

//! redisClient.connect().catch(console.error)
//export { RedisStore };
//export const redisStore = new RedisStore({ client: redisClient });
