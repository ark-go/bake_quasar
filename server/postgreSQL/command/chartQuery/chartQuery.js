import { botSendMessage } from "../../../tg/startTgBot.js";
import { loadSaleOtchet } from "./loadSaleOtchet.js";
import { loadSaleOtchetTovar } from "./loadSaleOtchetTovar.js";
import { loadSaleOtchetDay } from "./loadSaleOtchetDay.js";

/**
 * Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function chartQuery(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  //let mess = "Продажи, cmd: " + req.body?.cmd;
  // if (req.body.cmd != "addBakeryArticleOneDay") botSendMessage(mess, req);
  console.log("chartQuery", req.body);
  switch (req.body.cmd) {
    case "loadSaleOtchet":
      return await loadSaleOtchet(req, res, "trademark", timezone);
    case "loadSaleOtchetTovar":
      return await loadSaleOtchetTovar(req, res, "trademark", timezone);
    case "loadSaleOtchetDay":
      return await loadSaleOtchetDay(req, res, "trademark", timezone);

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
