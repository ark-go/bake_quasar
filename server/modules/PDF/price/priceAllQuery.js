import { pool } from "../../../postgreSQL/initPostgreSQL.js";
import { priceAllPdf } from "./priceAllPdf.js";
import { toGroups } from "./toGroups.js";
import escape from "pg-escape";
export async function priceAllQuery(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  //req.session.user.currentPdf?.pdf?.tabname
  let wher = "";
  console.log("body", JSON.stringify(req.body, 0, 2));
  if (req.body?.commandExt && req.body?.commandExt?.actionType) {
    if (req.body.commandExt.actionType == "lastCena") {
      wher = "WHERE date_start = maxdatestart";
    }
  }

  let sqlP = {
    text: /*sql*/ `
    SELECT bakery_name,kagent_name,date_start,mindatestart,maxdatestart,article,price_name,product_name,docpricelist_sena,typeprefix,docprice_docnum from
    (
    SELECT 
    to_char( docprice.datestart,  'DD.MM.YYYY') as "date_start",
    bakery.name AS bakery_name,
    kagent.name AS kagent_name,
    docprice.docnum AS docprice_docnum,
    -- products.document_num AS ttk,
    producttype.prefix AS typeprefix,
    docpricelist.cena AS docpricelist_sena,
    --docprice.id AS docprice_id,
    to_char(min(docprice.datestart) OVER w,  'DD.MM.YYYY') as "mindatestart",
    to_char(max(docprice.datestart) OVER w,  'DD.MM.YYYY') as "maxdatestart",
    --min(docprice.datestart) OVER w AS mindatestart,
    --max(docprice.datestart) OVER w AS maxdatestart,
    docpricelist.article AS article,
    trademark.name AS trademark_name,
    docpricelist.price_name AS price_name,

    concat(productassortment.name,' ',productvid.name,' ',productvid.nameext) AS product_name
    --article,
    ---price_name,
    --docbakery.id AS docbakery_id,
    
    -- LEFT ???
    FROM docbakery
    JOIN bakery ON bakery.id = docbakery.bakery_id
    JOIN docprice ON docprice.id = docbakery.docprice_id
    JOIN kagent_tm ON kagent_tm.id = docprice.kagent_tm_id
    JOIN kagent ON kagent.id = kagent_tm.kagent_id
    JOIN trademark ON trademark.id = kagent_tm.trademark_id
    JOIN docpricelist ON docpricelist.docprice_id = docbakery.docprice_id --AND docpricelist.product-s_id IS NOT NULL
    --JOIN products ON products.id = docpricelist.product-s_id
    --JOIN productvid ON productvid.id = products.productvid_id
    JOIN productvid ON productvid.id = docpricelist.productvid_id
    JOIN productassortment ON productassortment.id = productvid.productassortment_id
    JOIN producttype ON producttype.id = productassortment.producttype_id
    WINDOW w AS (partition BY  docbakery.bakery_id, productvid_id ORDER BY docbakery.bakery_id, productvid_id  )
    --)
    --SELECT * FROM maxmintable
    ) AS minmaxtable
    ${wher}
    ORDER BY  bakery_name,product_name,date_start,kagent_name;
    `,
    values: [],
    //rowMode: "array",
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;

    if (!result) {
      return {
        error: "Нет данных о продукте.",
      };
    }
    console.log("Выбрано строк priceAllQuery:", result?.length);
    // console.log(result);
    //  console.log(JSON.stringify(toGroups(result), 0, 2));
    return priceAllPdf(req, res, toGroups(result));
    // return {
    //   error: "Нет данных о продукте.",
    // };
  } catch (err) {
    console.log("Ошибка чтения ", err.toString());
    return {
      error: err.toString(),
    };
  }
}
