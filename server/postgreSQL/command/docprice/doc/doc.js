import { load } from "./load.js";
import { add } from "./add.js";
//import { update } from "./update.js";
import { del } from "./delete.js";
import { allSprav } from "./allSprav.js";
//import { pdfAll } from "./pdfAll.js";

/** productrawvid

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function doc(pool, req, cmd, tabname) {
  // выбираем направление
  switch (cmd) {
    case "load":
      return await load(pool, req, tabname);
    case "add":
      return await add(pool, req, tabname);
    case "update":
      return await update(pool, req, tabname);
    case "delete":
      return await del(pool, req, tabname);
    case "allSprav":
      return await allSprav(pool, req, tabname);
    case "pdfAll":
      return await pdfAll(pool, req, tabname);
    default:
      return {
        error: "Запрещено, не указаны данные." + cmd + ": " + tabname,
      };
  }
}
