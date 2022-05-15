import { pool } from "../../../postgreSQL/initPostgreSQL.js";
import { ingredientSostavPdf } from "./ingredientSostavPdf.js";
export async function ingredientSostavQuery(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let sqlP = {
    text: /*sql*/ `
    WITH all_childs_from_products_id AS (
      WITH RECURSIVE r AS (
        SELECT id, products_id_child,products_id,is_raw, productraw_id,massbrutto,massnetto,massfinish,proportion_b
        FROM productingred
        WHERE products_id = 140 --91
     
        UNION 
     
        SELECT pr.id, pr.products_id_child,pr.products_id,pr.is_raw, pr.productraw_id, pr.massbrutto, pr.massnetto, pr.massfinish, pr.proportion_b
        FROM productingred AS pr
           JOIN r  ON pr.products_id = r.products_id_child
     )
     
     SELECT * FROM r
    )
    
    select 
    CASE WHEN ing.is_raw IS TRUE THEN
       'С'
         ELSE
      'ПФ'
    END,
    concat(vidmain.name,' ',vidmain.nameext,' ', prodmain.name,' (',prodmain.massa,')'),
    CASE WHEN ing.products_id_child  IS NOT NULL THEN 
       concat(productvid.name,' ',productvid.nameext,' ', products.name,' (',products.massa,')')
       WHEN ing.productraw_id  IS NOT NULL THEN 
       concat(productraw.name)
       ELSE  
       'Нет данных (ошибка)'
    END,
       products.document_num

    from all_childs_from_products_id as ing
    
    LEFT JOIN products ON products.id = ing.products_id_child
    LEFT JOIN products as prodmain ON prodmain.id = ing.products_id
    LEFT JOIN productvid ON productvid.id = products.productvid_id
      LEFT JOIN productvid as vidmain ON vidmain.id = prodmain.productvid_id
    LEFT JOIN productraw ON productraw.id = ing.productraw_id

    `,
    values: [],
    rowMode: "array",
  };
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("ingredientSostavQuery:", result);
    return ingredientSostavPdf(res, result);
  } catch (err) {
    console.log("Ошибка чтения ", err.toString());
    return res.status(404).send("error: " + err.toString());
  }
}
