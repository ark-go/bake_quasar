import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
import { move } from "./move.js";
import { insert } from "./insert.js";
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
export async function userroletree(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  // let mess = "Таблица tree, cmd: " + req.body?.cmd;
  // botSendMessage(mess, req);

  let tabname = "tree"; //
  switch (req.body.cmd) {
    case "load":
      return await load(req, res, tabname, timezone);
    // case "add":
    //   return await add(req, res, tabname, timezone);
    case "update":
      return await update(req, res, tabname, timezone);
    case "delete":
      return await del(req, res, tabname, timezone);
    case "move":
      return await move(req, res, tabname, timezone);
    case "insert":
      return await insert(req, res, tabname, timezone);
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
