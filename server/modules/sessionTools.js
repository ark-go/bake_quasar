//https://luin.github.io/ioredis/classes/Redis.html#getex
import Redis from "ioredis";
import moment from "moment-timezone";
const redis = new Redis();
// const redis = new Redis({
//   port: process.env.Redis_host, // Redis port
//   host: process.env.Redis_host, // Redis host
//   //username: process.env., // needs Redis >= 6
//   //password: process.env.,
//   db: process.env.Redis_db, // Defaults to 0
// });
//process.argv  2 нужен

let mom = moment.tz(Date.now(), "Asia/Yekaterinburg");
console.log("moment", mom, Math.round(mom.valueOf() / 1000));

let keys = await redis.keys("*");
console.log(keys);
for (const k of keys) {
  let val = await redis.get(k);
  val = JSON.parse(val);
  //let expire = await redis.expiretime(k);
  if (!val?.user?.email) {
    //   await redis.del(k); // удалит все без usera
  }
  console.log(k, val?.userTmp);

  // console.log(k, val.user);
}

for (const k of keys) {
  let val = await redis.get(k);
  val = JSON.parse(val);
  if (!val) {
    // await redis.del(k);
  }
  //  await redis.del(k);
}

redis.disconnect();
//redis.quit()
