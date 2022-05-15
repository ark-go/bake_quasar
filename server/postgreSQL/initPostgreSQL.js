import pg from "pg";
import path from "path";
import { rootDir } from "../dirModule.cjs";
// только для отдельного запуска при создании таблиц
if (!process.env.PG_database) {
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(rootDir, ".env") });
  console.log("BASE USER:", process.env.PG_user);
}

console.log("Загрузка initPostgreSQL.js");
//var types = require("pg").types;
//import { types } from "pg";
var types = pg.types;
// попробуем обнулить пояс
types.setTypeParser(1114, function (stringValue) {
  return new Date(stringValue + "+0000");
});
// Парсер перехватывает полученные данные из базы и тут их можно подправить
// например ловим тип днных 1114 (timestamp) постгрес оперирует с микросекундами
// нам они тут не нужны поэтому отнимем три лишних знака у пришедшего timestamp.
// получить все коды OID можно из консоли
// psql -c "select typname, oid, typarray from pg_type order by oid"
// psql -c "select typname, oid, typarray from pg_type where typname = 'timestamp' order by oid"
// засунуть обратно можно с помошью команды в sql to_timestamp(number) либо через параметр $1
// sql  date_part('epoch',CURRENT_TIMESTAMP)::int - преобразует в unix код в звпросе
// types.setTypeParser(1114, function(stringValue) {
//   console.log(
//     "на парсере вот ЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭто",
//     stringValue,
//     Date.parse(stringValue),
//     new Date(Date.parse(stringValue))
//   );
//   return new Date(Date.parse(stringValue)); //.getTime();
//   //  // // // return (new Date(Date.parse(stringValue)).getTime() / 1000) | 0; // делим - отбрасываем запятую
// }); // 1114  1184

const pool = new pg.Pool({
  user: process.env.PG_user,
  host: process.env.PG_host,
  database: process.env.PG_database,
  password: process.env.PG_password,
  port: process.env.PG_port,
});
pool.on("error", (err, client) => {
  console.error(
    "Неизвестная ошибка на свободном клиенте - pool postgreSQL",
    err
  );
  // process.exit(-1);
});
pool.on("acquire", (client) => {
  // получение клиента из пула.
  // console.error("Pool Кол-во клиентов: ", pool.totalCount);
  // if (pool.idleCount)
  //   console.error(
  //     "Pool Кол-во простатвающих клиентов (плохо наверно): ",
  //     pool.idleCount
  //   );
  if (pool.waitingCount)
    console.error("Pool Кол-во ожидающик клиента из пула: ", pool.waitingCount);
});
pool.on("connect", (client) => {
  // при коннекте с базой, установим путь к нашей схеме
  client.query(`SET search_path TO ${process.env.PG_schema}`); //tsgbase");
  console.log(
    "===> подключились к базе postgreSQL. (" +
      pool.totalCount +
      "), ждут (" +
      pool.waitingCount +
      ")"
  );
});

export { pool };
