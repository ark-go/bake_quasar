import { redisClient } from "./utils/changeUser.js";
export async function test() {
  //   let s = await redisClient.keys("*");
  //   let g = await redisClient.get(s[5]);
  //   console.log(s, g);
  /*
var stream = redis.scanStream({
     ---можем указать фильтр 
  match: 'user:*',
        --возвращает примерно 100 элементов за вызов
  count: 100
});
*/
  // !--------------------------------------------------------
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
  let arrOfKeys = await getKeys(keyPrefix + "sess:*");
  console.log(arrOfKeys);
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
  var stream = redisClient.scanStream({
    match: redisClient.options.keyPrefix,
  });
  var keys = [];
  stream.on("data", function (resultKeys) {
    // `resultKeys` is an array of strings representing key names
    for (var i = 0; i < resultKeys.length; i++) {
      keys.push(resultKeys[i]);
      //  console.log(">", resultKeys[i]);
      redisClient.get(resultKeys[i], function (err, result) {
        //    console.log(err, result);
      });
    }
  });
  stream.on("end", function () {
    console.log("done with the keys: ", keys);
    // ----
    // let keyPrefix = redisClient.options.keyPrefix;
    // Promise.all(
    //   keys.map((key) => {
    //     return redisClient.get(key.replace(new RegExp("^" + keyPrefix), ""));
    //   })
    // ).then((values) => {
    //   console.log("promise", values);
    //   //   console.log(
    //   //     "test",
    //   //     JSON.parse(key.replace(new RegExp("^" + keyPrefix), ""))
    //   //   );
    // });

    // ---
  });

  //console.log("value", values);

  //   for (const item of array) {
  //     await delayedLog(item);
  //   }

  //   let keyPrefix = redisClient.options.keyPrefix;
  //   Promise.all(
  //     keys.map((key) => {
  //       console.log("test", key.replace(new RegExp("^" + keyPrefix), ""));
  //       return redisClient.getAsync(key.replace(new RegExp("^" + keyPrefix), ""));
  //     })
  //   ).then((values) => {
  //     console.log("promise", values);
  //   });
  // устаовить ключ
  // let m1 = await redisClient.set("ark2", "Привет2");

  // получим текущий префикс
  console.log("Prefix:", redisClient.options.keyPrefix);
  // получаем ключ, для работы
  //   let gg = "bread-and-tandoor:sess:MXZ7I6Xjr31n6UlJWeLdlpzEaZ6kMACY".replace(
  //     new RegExp("^" + keyPrefix),
  //     ""
  //   );
  // console.log("key:", gg);
  //   let keySess =
  //     redisClient.options.keyPrefix + // префикс, вероятно он не нужен в работе, и его надо опускать
  //     "sess:" +
  //     "8ObbqjgQdS68Jv4DDrT9B-K6EoLlBAFF";
  // получаем сессию по sid
  /*
  let keySess = "sess:" + "8ObbqjgQdS68Jv4DDrT9B-K6EoLlBAFF";
  let keyValue = await redisClient.get(keySess);
  keyValue = JSON.parse(keyValue);
  console.log(">m>m2>", keyValue);
  */
  // -----------------------------------------
  return;
}
// import Redis from "ioredis";
// import connectRedis from "connect-redis";
// import session from "express-session";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const { name } = require("../package.json");

// export const redisStore = connectRedis(session);
// export const redisClient = new Redis({
//   //showFriendlyErrorStack: true, // только для отладки.. для вывода нормальных ошибок
//   keyPrefix: process.env.Redis_prefix
//     ? process.env.Redis_prefix + ":"
//     : name + ":",
//   port: process.env.Redis_port, // Redis port
//   host: process.env.Redis_host, // Redis host
//   family: 4, // 4 (IPv4) or 6 (IPv6)
//   password: process.env.Redis_password,
//   db: process.env.Redis_db,
// });
