import { botSendMessage } from "../../../tg/startTgBot.js";
import { loadTrademark } from "./loadTrademark.js";
import { loadBakery } from "./loadBakery.js";
import { loadBakeryArticle } from "./loadBakeryArticle.js";
import { loadBakeryArticleAndBuffer } from "./loadBakeryArticleAndBuffer.js";

import { toggleHiddenArticle } from "./toggleHiddenArticle.js";
import { loadBakeryArticleOneDay } from "./loadBakeryArticleOneDay.js";
import { addBakeryArticleOneDay } from "./addBakeryArticleOneDay.js";
import { loadTerritory } from "./loadTerritory.js";
import { sendTextToTable } from "./sendTextToTable.js";
import { insertBufferToSale } from "./insertBufferToSale.js";

/**
 * Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function tabSale(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let mess = "Продажи, cmd: " + req.body?.cmd;
  if (req.body.cmd != "addBakeryArticleOneDay") botSendMessage(mess, req);
  console.log("tabSale", req.body);
  let tabname = "docprice";
  switch (req.body.cmd) {
    case "loadTrademark":
      return await loadTrademark(req, res, "trademark", timezone);
    case "loadBakery":
      return await loadBakery(req, res, "bakery", timezone);
    case "loadBakeryArticle":
      return await loadBakeryArticle(req, res, "bakery", timezone);
    case "loadBakeryArticleAndBuffer":
      return await loadBakeryArticleAndBuffer(req, res, "bakery", timezone);

    case "toggleHiddenArticle":
      return await toggleHiddenArticle(req, res, "bakery", timezone);
    case "loadBakeryArticleOneDay":
      return await loadBakeryArticleOneDay(req, res, "bakery", timezone);
    case "addBakeryArticleOneDay":
      return await addBakeryArticleOneDay(req, res, "bakery", timezone);
    case "loadTerritory":
      return await loadTerritory(req, res, "bakery", timezone);
    case "sendTextToTable":
      return await sendTextToTable(req, res, "bakery", timezone);
    case "insertBufferToSale":
      return await insertBufferToSale(req, res, "bakery", timezone);

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
