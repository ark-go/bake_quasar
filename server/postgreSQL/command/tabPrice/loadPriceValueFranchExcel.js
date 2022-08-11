import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";

export async function loadPriceValueFranchExcel(
  req,
  res,
  tabname,
  timezone,
  idOne
) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  // читаем список цен только для франчайзи
  //  let wher = "";
  // if (idOne) wher = ` where price.id = $2`;
  // console.log("loadPriceValueFranchExcel req.body",req.body);
  let andWhere = "";
  if (req.body.price_bakery_id != -100) {
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
      kag.name as kagent_franch_name,
    --  CASE WHEN bakery.name IS NULL  THEN bakery_all.name
    --  else bakery.name
    --  END as bakery_name,
     bakery.name as bakery_name,
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

     -- LEFT JOIN price_bakery prbak on prbak.price_id = price_value.price_id
      --
      LEFT JOIN price_bakery_franch as price_franch on price_franch.price_value_id = price_value.id   -- у позиции прайса есть печка франча
      ${andWhere}     -- здесь указаена интересующая на печка
    --  AND price_franch.price_bakery_id = $2
    --   LEFT JOIN price_bakery prbak on prbak.id = price_value.price_bakery_id
    LEFT JOIN price_bakery prbak on prbak.id = price_franch.price_bakery_id  -- есть ли печка в прайсе
    LEFT JOIN bakery on bakery.id = prbak.bakery_id
    LEFT JOIN kagent kag on kag.id = price_franch.kagent_id
        --AND price_bakery_id = $2 -- только эту печку
      --lateral
    -- попробуем достать печки остальные, кроме франчей.
   -- LEFT JOIN price_bakery as price_bakery on price_bakery.bakery_id = $2   -- печки прайса все
   --  AND price_bakery.bakery_id = $2
   --  LEFT JOIN bakery bakery_all on bakery_all.id = price_bakery.bakery_id

    


      where price_value.price_id = $1
      ORDER BY productvid_name
`,
    values: [
      req.body.price_id, // 1
      req.body.price_bakery_id || 0, //! TODO: вот что с этим делать? надо решить
      //  timezone // 2
    ],
  };
  if (andWhere) {
    sqlP.values = [
      req.body.price_id, // 1
      req.body.price_bakery_id || 0, // это ссылка на ID price_bakery... а там внутри естьсслка на bakery_id
      //   req.body.bakery_id,
    ];
  } else {
    sqlP.values = [req.body.price_id];
  }

  // if (idOne) sqlP.values = [timezone, idOne];
  console.log("loadPriceValueFranchExcel", req.body);
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : [];
    //  console.log("loadPriceValueFranch", result);
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
