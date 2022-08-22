import { botSendMessage } from "../../../tg/startTgBot.js";
import { loadTrademark } from "./loadTrademark.js";
import { loadBakery } from "./loadBakery.js";
import { loadBakeryArticle } from "./loadBakeryArticle.js";
import { toggleHiddenArticle } from "./toggleHiddenArticle.js";
import { loadBakeryArticleOneDay } from "./loadBakeryArticleOneDay.js";
import { addBakeryArticleOneDay } from "./addBakeryArticleOneDay.js";

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
  botSendMessage(mess, req);
  console.log("tabSale", req.body);
  let tabname = "docprice";
  switch (req.body.cmd) {
    case "loadTrademark":
      return await loadTrademark(req, res, "trademark", timezone);
    case "loadBakery":
      return await loadBakery(req, res, "bakery", timezone);
    case "loadBakeryArticle":
      return await loadBakeryArticle(req, res, "bakery", timezone);
    case "toggleHiddenArticle":
      return await toggleHiddenArticle(req, res, "bakery", timezone);
    case "loadBakeryArticleOneDay":
      return await loadBakeryArticleOneDay(req, res, "bakery", timezone);
    case "addBakeryArticleOneDay":
      return await addBakeryArticleOneDay(req, res, "bakery", timezone);

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
