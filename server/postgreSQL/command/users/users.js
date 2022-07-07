import { load } from "./load.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
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
export async function users(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let mess = "Таблица bakery Пекарни, cmd: " + req.body?.cmd;
  botSendMessage(mess, req);

  let tabname = "users";
  switch (req.body.cmd) {
    case "load":
      return await load(req, res, tabname, timezone);
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
      return await addToGroup(req, res, "territory_x_bakery", timezone);
      // case "info":
      // Перенос территорию к печке
      return await info(req, res, "territory_x_bakery", timezone);
    //  case "removeFromGroup":
    //   // Перенос территорию к печке
    //   return await removeFromGroup(req, res, "territory_x_bakery", timezone);

    // case "terr_delete":
    // удалим территорию из печки
    //   return await terr_delete(req, res, "territory_bakery", timezone);
    default:
      return {
        error:
          "Запрещено, не указаны данные." + req.body?.cmd + req.body?.tableName,
      };
  }
}
