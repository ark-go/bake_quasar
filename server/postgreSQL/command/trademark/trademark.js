import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
/**
 * Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export function trademark(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  //   if (!["trademark"](req.body?.tableName)) {
  //     return {
  //       error: "Запрещено, не правильный запрос.",
  //     };
  //   }
  console.log("trademark на ", req.body);
  let tabname = "trademark";
  switch (req.body.cmd) {
    case "load":
      return load(req, res, tabname, timezone);
    case "add":
      return add(req, res, tabname, timezone);
    case "update":
      return update(req, res, tabname, timezone);
    case "delete":
      return del(req, res, tabname, timezone);

    default:
      return {
        error:
          "Запрещено, не указаны данные." + req.body?.cmd + req.body?.tableName,
      };
  }
}
