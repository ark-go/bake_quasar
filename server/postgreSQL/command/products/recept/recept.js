// import { load } from "./load.js";
// import { add } from "./add.js";
// import { update } from "./update.js";
// import { del } from "./delete.js";
//import { pdfAll } from "./pdfAll.js";
import { loadProducts } from "./loadProducts.js";
import { loadRaw } from "./loadRaw.js";
import { loadIngredient } from "./loadIngredient.js";
/** productrawvid

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function recept(pool, req, cmd, tabname, timezone) {
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
    case "loadProducts":
      tabname = "products";
      return await loadProducts(pool, req, tabname, timezone);
    case "loadRaw":
      tabname = "productraw";
      return await loadRaw(pool, req, tabname, timezone);
    case "loadIngredient":
      tabname = "productingred";
      return await loadIngredient(pool, req, tabname, timezone);
    default:
      return {
        error: "Запрещено, не указаны данные.(2)" + cmd + " : " + tabname,
      };
  }
}
