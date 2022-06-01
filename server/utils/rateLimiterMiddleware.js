//! https://github.com/animir/node-rate-limiter-flexible/wiki/Options
import { redisClient } from "./ioredisStore.js";
import { RateLimiterRedis } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterRedis({
  // для /api/
  storeClient: redisClient,
  keyPrefix: "rateLimiterMiddleware",
  points: 10, // 10 запросов
  duration: 1, // за секунду с IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      console.log("Rate Limiter Слишком много запросов");
      res.status(429).send("Слишком много запросов");
    });
};
const rateLimiterLlogin = new RateLimiterRedis({
  // для кнопки Логин
  storeClient: redisClient,
  keyPrefix: "rateLimiterMiddleware",
  points: 2, // 2 запросов в duration
  duration: 1, // за секунду с IP
  blockDuration: 10, //
});

const rateLimiterMiddlewareLogin = (req, res, next) => {
  rateLimiterLlogin
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      console.log("Rate Limiter Login Слишком много запросов");
      res.status(429).send("Слишком много запросов");
    });
};
export { rateLimiterMiddleware, rateLimiterMiddlewareLogin };
