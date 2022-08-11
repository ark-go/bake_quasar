import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValueFranch(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // читаем список цен только для франчайзи
  //  let wher = "";
  // if (idOne) wher = ` where price.id = $2`;
  console.log(req.body);
  let andWhere = "";
  if (req.body.bakery_id != -100) {
    // если -100 то хочу все печки, и пропускаю эту строку
    andWhere = " AND price_franch.price_bakery_id = $2";
  }

  tabname = "price_value";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      price_value.id as "id",
      price_value.price_id as price_id,
      price_value.article as article,
      price_value.price_name as price_name,
      price_value.productvid_id as productvid_id,
      concat(ptype.prefix,' ',assort.name,' ',pvid.name,' ',pvid.nameext,' ',unit.name) AS productvid_name,
      price_value.cena as cena,
      price_franch.cena as franch_cena,
      price_franch.description as franch_description,
      kag.name as kagent_name,
      bakery.name as bakery_name,
    --  franch.franch_list as franch_list,
      price_value.description as description,
      --
      price_value.user_id as "user_id",
      price_value.user_date as "user_date",
      price_value.meta as "meta"
      from price_value
      LEFT JOIN productvid as pvid on pvid.id =  price_value.productvid_id
      LEFT JOIN productassortment as assort on assort.id = pvid.productassortment_id
      LEFT JOIN unit on unit.id = pvid.unit_id
      LEFT JOIN producttype as ptype on ptype.id = assort.producttype_id

      LEFT JOIN price_bakery_franch as price_franch on price_franch.price_value_id = price_value.id   -- печки которые были якобы франча
      ${andWhere} 
    --  AND price_franch.price_bakery_id = $2
       LEFT JOIN price_bakery prbak on prbak.id = price_franch.price_bakery_id
     -- LEFT JOIN price_bakery prbak on prbak.price_id = $1
      LEFT JOIN bakery on bakery.id = prbak.bakery_id
      LEFT JOIN kagent kag on kag.id = price_franch.kagent_id
        --AND price_bakery_id = $2 -- только эту печку
      --lateral
      
    --  LEFT JOIN  lateral (
    --      SELECT price_value.id, STRING_AGG ('(' || pbf.cena::text || ') ' || kagent.name, ';') as franch_list 
    --      from price_value  -- здесь все печки прайса
    --      LEFT JOIN price_bakery_franch as pbf on pbf.price_value_id = price_value.id -- печки которые были якобы франча
    --      LEFT JOIN kagent on kagent.id = pbf.kagent_id -- контрагент указанный в тех печках
    --     -- where  price_value.id = price_value.price_id -- отфильтруем только печки из прайса
    --      GROUP BY price_value.id -- сгруппируем и сложим нашик контров
    --  ) as franch on franch.id = price_value.id  -- соезиним с запросом по прайсу


      where price_value.price_id = $1
      ORDER BY productvid_name
`,
    values: [
      req.body.price_id, // 1
      req.body.bakery_id || 0, //! TODO: вот что с этим делать? надо решить
      //  timezone // 2
    ],
  };
  if (andWhere) {
    sqlP.values = [
      req.body.price_id, // 1
      req.body.bakery_id || 0,
    ];
  } else {
    sqlP.values = [req.body.price_id];
  }

  // if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : [];
    // console.log("loadPriceValueFranch", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения loadPriceValue", err.toString());
    return {
      error: err.toString(),
    };
  }
}
