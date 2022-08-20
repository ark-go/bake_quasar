//! https://github.com/animir/node-rate-limiter-flexible/wiki/Options
import { redisClient } from "./ioredisStore.js";
import { RateLimiterRedis } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterRedis({
  // для /api/
  storeClient: redisClient,
  keyPrefix: "rateLimiterMiddleware1",
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
      res.status(429).send("Слишком много запросов 1");
    });
};
// -----------------------------
const rateLimiterLlogin = new RateLimiterRedis({
  // для кнопки Логин
  storeClient: redisClient,
  keyPrefix: "rateLimiterMiddleware2",
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
    .catch((e) => {
      console.log(
        "Rate Limiter Login Слишком много запросов",
        JSON.stringify(e)
      );
      res
        .status(429)
        .send(
          "Не надо часто делать запросы !<br>бан: " +
            e.msBeforeNext / 1000 +
            " сек."
        );
      // e {"remainingPoints":0,"msBeforeNext":10000,"consumedPoints":3,"isFirstInDuration":false}
    });
};
const rateLimiterReq = new RateLimiterRedis({
  // для кнопки Логин
  storeClient: redisClient,
  keyPrefix: "rateLimiterReq",
  points: 1, // 2 запросов в duration
  duration: 1, // за секунду с IP
  blockDuration: 10, //
});
const rateLimiterMiddlewareReq = (req, res, next) => {
  if (!["loadBakeryArticle"].includes(req.body?.cmd)) {
    return next();
  }

  rateLimiterReq
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch((e) => {
      console.log("Rate Limiter Req Слишком много запросов", req.ip);
      res.status(429).json({
        error: "Много запросов",
        text:
          "Не надо часто делать запросы !<br>бан: " +
          e.msBeforeNext / 1000 +
          " сек.",
        timeOut: e.msBeforeNext,
      });
      // e {"remainingPoints":0,"msBeforeNext":10000,"consumedPoints":3,"isFirstInDuration":false}
    });
};
// -----------------------------
const rateLimiterRegUser = new RateLimiterRedis({
  // для кнопки Логин
  storeClient: redisClient,
  keyPrefix: "rateLimiterMiddleware3",
  points: 5, // 2 запросов в duration
  duration: 1, // за секунду с IP
  blockDuration: 10, //
});

const rateLimiterMiddlewareRegUser = (req, res, next) => {
  rateLimiterRegUser
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      console.log("Rate Limiter Login Слишком много запросов 3");
      res.status(429).send("Слишком много запросов");
    });
};
export {
  rateLimiterMiddleware,
  rateLimiterMiddlewareLogin,
  rateLimiterMiddlewareRegUser,
  rateLimiterMiddlewareReq,
};
