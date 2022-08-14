import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./del.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { loadTrademark } from "./loadTrademark.js";
import { loadKagent } from "./loadKagent.js";
import { loadKagentOwn } from "./loadKagentOwn.js";
import { loadPricevid } from "./loadPricevid.js";
import { addDocument } from "./addDocument.js";
import { loadBakeryTrademarkKagent } from "./loadBakeryTrademarkKagent.js";
import { loadBakeryDocument } from "./loadBakeryDocument.js";
import { addBakeryToPrice } from "./addBakeryToPrice.js";
import { deleteBakeryFromPrice } from "./deleteBakeryFromPrice.js";
import { deleteDocument } from "./deleteDocument.js";
import { loadPriceValue } from "./loadPriceValue.js";
import { loadPriceValueProductVid } from "./loadPriceValueProductVid.js";
import { addPriceValue } from "./addPriceValue.js";
import { deletePriceValue } from "./deletePriceValue.js";
import { loadPriceValueFranch } from "./loadPriceValueFranch.js";
import { insertFranchCena } from "./insertFranchCena.js";
import { loadPriceValueSelectArticle } from "./loadPriceValueSelectArticle.js";
import { loadPriceValueAll } from "./loadPriceValueAll.js";
//import { add } from "./add.js";
// import { update } from "./update.js";
// import { del } from "./delete.js";
// import { allSprav } from "./allSprav.js";
// import { loadKagentTM } from "./loadKagentTM.js";
//import { addToGroup } from "./addToGroup.js";
//import { removeFromGroup } from "./removeFromGroup.js";
//import { info } from "./info.js";

/**

/**
* Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function tabPrice(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let mess = "Док.прайс, cmd: " + req.body?.cmd;
  botSendMessage(mess, req);
  console.log("tabPrice", req.body);
  let tabname = "docprice";
  switch (req.body.cmd) {
    case "load":
      return await load(req, res, tabname, timezone);
    case "addDocument":
      return await addDocument(req, res, tabname, timezone);
    case "delete":
      return await del(req, res, tabname, timezone);
    case "update":
      return await update(req, res, tabname, timezone);
    case "loadTrademark":
      return await loadTrademark(req, res, "trademark", timezone);
    case "loadKagent":
      return await loadKagent(req, res, "trademark", timezone);
    case "loadKagentOwn":
      return await loadKagentOwn(req, res, "trademark", timezone);
    case "loadPricevid":
      return await loadPricevid(req, res, "docpricevid", timezone);
    case "loadBakeryTrademarkKagent":
      return await loadBakeryTrademarkKagent(req, res, "", timezone);
    case "loadBakeryDocument":
      return await loadBakeryDocument(req, res, "", timezone);

    case "addBakeryToPrice":
      return await addBakeryToPrice(req, res, "", timezone);
    case "deleteBakeryFromPrice":
      return await deleteBakeryFromPrice(req, res, "", timezone);
    case "deleteDocument":
      return await deleteDocument(req, res, "", timezone);
    case "loadPriceValue":
      return await loadPriceValue(req, res, "", timezone);
    case "loadPriceValueProductVid":
      return await loadPriceValueProductVid(req, res, "", timezone);
    case "addPriceValue":
      return await addPriceValue(req, res, "", timezone);
    case "deletePriceValue":
      return await deletePriceValue(req, res, "", timezone);
    case "loadPriceValueFranch":
      return await loadPriceValueFranch(req, res, "", timezone);
    case "insertFranchCena":
      return await insertFranchCena(req, res, "", timezone);
    case "loadPriceValueSelectArticle":
      return await loadPriceValueSelectArticle(req, res, "", timezone);

      // case "add":
      //   // console.log("for update", req.body);
      //   return await add(req, res, tabname, timezone);
      // case "update":
      //   return await update(req, res, tabname, timezone);
      // case "delete":
      //   return await del(req, res, tabname, timezone);
      // case "allSprav":
      //   return await allSprav(req, res, timezone);
      // case "loadKagentTM":
      //   return await loadKagentTM(req, res, timezone);
      // case "addToGroup":
      // Добавить территорию к печке
      return await addToGroup(req, res, "territory_x_bakery", timezone);
    // case "moveToGroup":
    // Перенос территорию к печке
    // return await addToGroup(req, res, "territory_x_bakery", timezone);
    // case "info":
    // Перенос территорию к печке
    // return await info(req, res, "territory_x_bakery", timezone);
    //  case "removeFromGroup":
    //   // Перенос территорию к печке
    //   return await removeFromGroup(req, res, "territory_x_bakery", timezone);

    // case "terr_delete":
    // удалим территорию из печки
    //   return await terr_delete(req, res, "territory_bakery", timezone);
    default:
      return {
        error:
          "Запрещено, не указаны данные." +
          req.body?.cmd +
          " " +
          req.body?.tableName,
      };
  }
}
