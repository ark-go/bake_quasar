import { loadSprav } from "./loadSprav.js";
import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
//import { allSprav } from "./allSprav.js";
//import { pdfAll } from "./pdfAll.js";

/** productrawvid

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function bakery(pool, req, cmd, tabname) {
  // выбираем направление
  switch (cmd) {
    case "load":
      return await load(pool, req, "docbakery");
    case "loadSprav":
      return await loadSprav(pool, req, "bakery"); //!здесь другая табличка
    case "add":
      return await add(pool, req, "docbakery");
    case "update":
      return await update(pool, req, "docbakery");
    case "delete":
      return await del(pool, req, "docbakery");
    case "allSprav":
      return await allSprav(pool, req, "docbakery");
    case "pdfAll":
      return await pdfAll(pool, req, "docbakery");
    default:
      return {
        error: "Запрещено, не указаны данные." + cmd + ": " + "docbakery",
      };
  }
}
