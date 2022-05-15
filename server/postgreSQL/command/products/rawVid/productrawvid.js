import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
import { pdfAll } from "./pdfAll.js";
/** productrawvid

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function productrawvid(pool, req, cmd, tabname, timezone) {
  // выбираем направление
  switch (cmd) {
    case "load":
      return await load(pool, req, tabname, timezone);
    case "add":
      return await add(pool, req, tabname, timezone);
    case "update":
      return await update(pool, req, tabname, timezone);
    case "delete":
      return await del(pool, req, tabname, timezone);
    case "pdfAll":
      return await pdfAll(pool, req, tabname, timezone);
    default:
      return {
        error: "Запрещено, не указаны данные." + cmd + ": " + tabname,
      };
  }
}
