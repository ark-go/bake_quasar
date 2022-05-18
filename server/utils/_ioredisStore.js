import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name } = require("../package.json");

const RedisStore = connectRedis(session);
const pubClient = new Redis.Cluster(
  [
    {
      keyPrefix: process.env.Redis_prefix
        ? process.env.Redis_prefix + ":"
        : name + ":",
      port: process.env.Redis_port, // Redis port
      host: process.env.Redis_host, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: process.env.Redis_password,
      db: process.env.Redis_db,
    },
    {
      port: process.env.Redis_port, // Redis port
      host: process.env.Redis_host + "kk", // Redis host
    },
  ],
  {
    maxRedirections: 1,
    //enableOfflineQueue: false,
    retryDelayOnFailover: 5000,
  }
);
//! redisClient.connect().catch(console.error)
export const redisStore = new RedisStore({ client: pubClient });
