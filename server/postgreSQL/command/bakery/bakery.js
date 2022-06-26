import { load } from "./load.js";
import { add } from "./add.js";
import { update } from "./update.js";
import { del } from "./delete.js";
import { allSprav } from "./allSprav.js";
import { loadKagentTM } from "./loadKagentTM.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import { deleteFromGroup } from "./deleteFromGroup.js";
import { terr_add } from "./terrytory/terr_add";
import { terr_delete } from "./terrytory/terr_delete";
/**

/**
* Необходимы параметры в запросе cmd,tableName,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function bakery(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let mess = "Таблица bakery Пекарни, cmd: " + req.body?.cmd;
  botSendMessage(mess, req);

  let tabname = "bakery";
  switch (req.body.cmd) {
    case "load":
      return await load(req, res, tabname, timezone);
    case "add":
      // console.log("for update", req.body);
      return await add(req, res, tabname, timezone);
    case "update":
      return await update(req, res, tabname, timezone);
    case "delete":
      return await del(req, res, tabname, timezone);
    case "allSprav":
      return await allSprav(req, res, timezone);
    case "loadKagentTM":
      return await loadKagentTM(req, res, timezone);
    case "deleteFromGroup":
      return await deleteFromGroup(req, res, "bakery_territory", timezone);
    case "terr_add":
      // Добавить территорию к печке
      return await terr_add(req, res, "bakery_territory", timezone);
    case "terr_delete":
      // удалим территорию из печки
      return await terr_delete(req, res, "bakery_territory", timezone);
    default:
      return {
        error:
          "Запрещено, не указаны данные." + req.body?.cmd + req.body?.tableName,
      };
  }
}
