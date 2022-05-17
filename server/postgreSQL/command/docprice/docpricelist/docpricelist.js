//import { loadSprav } from "./loadSprav.js";
import { load } from "./load.js";
import { loadProducts } from "./loadProducts.js";
import { add } from "./add.js";
//import { update } from "./update.js";
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
export async function docpricelist(pool, req, cmd, tabname) {
  // выбираем направление
  switch (cmd) {
    case "load":
      return await load(pool, req, "docpricelist");
    case "loadProducts":
      return await loadProducts(pool, req, "products");
    case "loadTovars":
      return await loadTovars(pool, req, "productvid");
    // case "loadSprav":
    //   return await loadSprav(pool, req, "docpricelist"); //!здесь другая табличка
    case "add":
      return await add(pool, req, "docpricelist");
    // case "update":
    //   return await update(pool, req, "docpricelist");
    case "delete":
      return await del(pool, req, "docpricelist");
    // case "allSprav":
    //   return await allSprav(pool, req, "docpricelist");
    // case "pdfAll":
    //   return await pdfAll(pool, req, "docpricelist");
    default:
      return {
        error: "Запрещено, не указаны данные." + cmd + ": " + "docpricelist",
      };
  }
}
