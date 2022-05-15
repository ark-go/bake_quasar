import { botSendMessage } from "../../../tg/startTgBot.js";
import { doc } from "./doc/doc.js";
import { bakery } from "./bakery/bakery.js";
import { docpricelist } from "./docpricelist/docpricelist.js";
import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";
/**

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function docprice(req, res) {
  console.log("docprice.js req:", req.body, req.body.dateRange);
  let tabname = req.body?.tabname;
  let cmd = req.body?.cmd;
  cmd = cmd && cmd.trim();
  tabname = tabname && tabname.trim();
  if (!cmd || !tabname) {
    return {
      error: "Запрещено, не указаны данные(1)." + cmd + " " + tabname,
    };
  }
  tabname = escape(tabname);
  // Сообщение контроль
  //let mess = "Запрос: docprice, cmd: " + cmd + ", tab: " + tabname;
  let mess = "\n" + JSON.stringify(req.body, null, 4);
  botSendMessage(mess, req);

  // выбираем направление
  switch (tabname) {
    case "docprice":
      return await doc(pool, req, cmd, tabname);
    case "bakery":
      return await bakery(pool, req, cmd, tabname);
    case "docpricelist":
      return await docpricelist(pool, req, cmd, tabname);

    default:
      return {
        error: "Запрещено, не указан путь." + cmd + ": " + tabname,
      };
  }
}
