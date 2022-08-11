import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValueProductVid(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // Это для списка выбора продуктов
  let wher = "";
  if (idOne) wher = ` where price.id = $2`;
  tabname = "productvid";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      productvid.id as id,
      concat(ptype.prefix,' ',assort.name,' ',productvid.name,' ',productvid.nameext,' ',unit.name) AS name

      from productvid
      LEFT JOIN productassortment as assort on assort.id = productvid.productassortment_id
      LEFT JOIN unit on unit.id = productvid.unit_id
      LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id

      ${wher}
      ORDER BY name
`,
    values: [],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : [];
    // console.log("loadBakeryDocument", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadPriceValueProductVid", err.toString());
    return {
      error: err.toString(),
    };
  }
}
