import { loadTrademark } from "./loadTrademark.js";
import { loadKagent } from "./loadKagent.js";
import { addTrademark } from "./addTrademark.js";
import { update } from "./update.js";
import { delTrademark } from "./delTrademark.js";
/**
 * Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export function kagent_tm(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  //   if (!["trademark"](req.body?.tableName)) {
  //     return {
  //       error: "Запрещено, не правильный запрос.",
  //     };
  //   }
  console.log("kagent_tm на ", req.body);
  let tabname = "kagent_tm";
  switch (req.body.cmd) {
    case "loadKagent":
      return loadKagent(req, res, tabname, timezone);
    case "loadTrademark":
      return loadTrademark(req, res, tabname, timezone);
    case "addTrademark":
      return addTrademark(req, res, tabname, timezone);
    case "update":
      return update(req, res, tabname, timezone);
    case "delTrademark":
      return delTrademark(req, res, tabname, timezone);

    default:
      return {
        error: "Запрещено, не указаны данные." + req.body?.cmd + " / ",
      };
  }
}
