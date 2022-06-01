import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
// import { allSprav } from "./allSprav.js";
// import { loadKagentTM } from "./loadKagentTM.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
/**

/**
* Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function departments(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let mess = "Таблица departments, cmd: " + req.body?.cmd;
  botSendMessage(mess, req);

  let tabname = "departments"; // departments
  switch (req.body.cmd) {
    case "load":
      return await load(req, res, tabname, timezone);
    case "add":
      //   // console.log("for update", req.body);
      return await add(req, res, tabname, timezone);
    case "update":
      return await update(req, res, tabname, timezone);
    case "delete":
      return await del(req, res, tabname, timezone);
    // case "allSprav":
    //   return await allSprav(req, res, timezone);
    // case "loadKagentTM":
    //   return await loadKagentTM(req, res, timezone);

    default:
      return {
        error: "Запрещено, не указаны данные. " + req.body?.cmd,
      };
  }
}
