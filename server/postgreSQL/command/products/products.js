import { botSendMessage } from "../../../tg/startTgBot.js";
import { productrawvid } from "./rawVid/productrawvid.js";
import { producttype } from "./type/producttype.js";
import { productvid } from "./vid/productvid.js";
import { productraw } from "./raw/productraw.js";
import { productsmain } from "./products/productsmain.js";
import { productingred } from "./productingred/productingred.js";
import { recept } from "./recept/recept.js";

import { pool } from "../../initPostgreSQL.js";
import escape from "pg-escape";
/**

/**
* Необходимы параметры в запросе cmd,tabname,add,load,update,delete
 * @param {} req
 * @param {*} res
 * @returns
 */
export async function products(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  console.log("Время клиента: ", req.session.timezone);
  let tabname = req.body?.tabname;
  let cmd = req.body?.cmd;
  cmd = cmd && cmd.trim();
  // let name = req.body?.name;
  // name = name && name.trim();
  tabname = tabname && tabname.trim();
  if (!cmd || !tabname) {
    return {
      error: "Запрещено, не указаны данные(1)." + cmd + " " + tabname,
    };
  }
  tabname = escape(tabname);
  //req.body.name = name;

  // Сообщение контроль
  let mess = "Запрос: products, cmd: " + cmd + ", tab: " + tabname;
  botSendMessage(mess, req);

  // выбираем направление
  switch (tabname) {
    case "productrawvid":
      return await productrawvid(pool, req, cmd, tabname, timezone);
    case "producttype":
      return await producttype(pool, req, cmd, tabname, timezone);
    case "productvid":
      return await productvid(pool, req, cmd, tabname, timezone);
    case "productraw":
      return await productraw(pool, req, cmd, tabname, timezone);
    case "products":
      return await productsmain(pool, req, cmd, tabname, timezone);
    case "productingred":
      return await productingred(pool, req, cmd, tabname, timezone);
    case "recept":
      return await recept(pool, req, cmd, tabname, timezone);
    default:
      return {
        error: "Запрещено, не указан путь." + cmd + ": " + tabname,
      };
  }
}
