//https://github.com/chalk/chalk
// можно еще посмотреть https://github.com/medikoo/cli-color

import { Chalk } from "chalk";
import { showTime } from "./showTime.js";
// надо поменять цветовой уровень т.к. у меня вот, 3-ий не пошел.
let chalk = new Chalk({ level: 2 });
//let chalk1 = new chalk.Instance({ level: 2 }); //new chalk1.constructor({enabled: true});
// подобрать уровень
// 0 - All colors disabled
// 1 - Basic color support (16 colors)
// * 2 - 256 color support
// 3 - Truecolor support (16 million colors) // у меня не заработал
/**
 *
 * @param {String} col col.error, warning, info, blue, silver
 * @param {String} msg
 * @param {Object} obj
 */
let log = function (col, msg, obj = "") {
  //console.log("Env: ",process.env.NODE_PATH);
  // NODE_LOG_LEVEL в стартовом файле для PM2  по умолчанию в блоке env:
  if (process.env.NODE_LOG_LEVEL == 0) return; // это моя переменная чтоб управлять логом

  //  msg = require("../modules/showtime")(false) + " : " + msg;
  msg = showTime(false) + " : " + msg;

  if (obj === "") console.log(col(msg));
  else console.log(col(msg), obj);
};

log.success = chalk.bold.green;
log.error = chalk.bold.red;
log.warning = chalk.hex("#FFA500"); // Orange color // chalk.yellow; //keyword("orange");
//log.info = chalk.keyword("green");
log.info = chalk.green;
log.blue = chalk.bold.blue;
log.silver = chalk.hex("#DEADED");

export { log };
// export let success = chalk.bold.green;
// export let error = chalk.bold.red;
// export let warning = chalk.yellow; //keyword("orange");
// //export let info = chalk.keyword("green");
// export let info = chalk.green;
// export let blue = chalk.bold.blue;
// export let silver = chalk.hex("#DEADED");
