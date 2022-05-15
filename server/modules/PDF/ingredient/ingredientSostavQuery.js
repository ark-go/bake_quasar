import { pool } from "../../../postgreSQL/initPostgreSQL.js";
import { ingredientSostavPdf } from "./ingredientSostavPdf.js";
import { toGroups } from "./toGroups.js";
import escape from "pg-escape";
export async function ingredientSostavQuery(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  //req.session.user.currentPdf?.pdf?.tabname
  //let id = req.session.user?.currentPdf?.pdf?.id;
  let id = req.body.id;
  console.log("Запрос PDF id=", id);
  let wher = "";
  if (id) {
    id = escape(id);
    wher = `WHERE products_id = ${id}`;
  }

  let sqlP = {
    text: /*sql*/ `
    WITH all_childs_from_products_id AS (
      WITH RECURSIVE r AS (
        SELECT id, products_id_child,products_id,is_raw, productraw_id,massbrutto,massnetto,massfinish,proportion_b,sumbrutto,sumnetto,sumfinish
        FROM productingred
 --       WHERE products_id = 140 --91
        ${wher}
     
        UNION 
     
        SELECT pr.id, pr.products_id_child,pr.products_id,pr.is_raw, pr.productraw_id, pr.massbrutto, 
                             pr.massnetto, pr.massfinish, pr.proportion_b, pr.sumbrutto, pr.sumnetto, pr.sumfinish
        FROM productingred AS pr
           JOIN r  ON pr.products_id = r.products_id_child
     )
     
     SELECT * FROM r
    )
    --   ----
    SELECT 
    concat(vidmain.name,' ',vidmain.nameext,' ',prodmain.name,' (', prodmain.massa,')') as main_product,
    prodmain.document_num AS document_num_pf,
    -- prodmain.massbrutto AS massbrutto_pf,
    -- prodmain.massnetto AS massnetto_pf,
    -- prodmain.massfinish AS massfinish_pf,
    ing.sumbrutto AS massbrutto_pf,
    ing.sumnetto AS massnetto_pf,
    ing.sumfinish AS massfinish_pf,
    CASE WHEN ing.is_raw IS TRUE THEN
       'С'
         ELSE
      'ПФ'
    END AS typeprod,
   -- concat(vidmain.name,' ',vidmain.nameext,' ', prodmain.name,' (',prodmain.massa,')'),
        CASE WHEN ing.is_raw IS TRUE THEN 
        concat(productraw.name) 
       ELSE 
       concat(productvid.name,' ',productvid.nameext,' ', products.name,' (',products.massa,')') 
       

    END AS name,
    ing.massbrutto,
    ing.massnetto,
    ing.massfinish,
    ing.proportion_b

    from all_childs_from_products_id as ing
    
    LEFT JOIN products ON products.id = ing.products_id_child
    LEFT JOIN products as prodmain ON prodmain.id = ing.products_id
    LEFT JOIN productvid ON productvid.id = products.productvid_id
      LEFT JOIN productvid as vidmain ON vidmain.id = prodmain.productvid_id
    LEFT JOIN productraw ON productraw.id = ing.productraw_id
    
    ORDER BY main_product, typeprod DESC, name
    `,
    values: [],
    //rowMode: "array",
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;

    if (!result) {
      if (!req.body?.command) {
        return res.status(404).send("Нет данных о продукте. ");
      } else {
        return {
          error: "Нет данных о продукте.",
        };
      }
    }
    console.log("Выбрано строк ingredientSostavQuery:", result?.length);
    return ingredientSostavPdf(req, res, toGroups(result));
  } catch (err) {
    console.log("Ошибка чтения ", err.toString());
    if (!req.body?.command) {
      return res.status(404).send("error: " + err.toString());
    } else {
      return {
        error: err.toString(),
      };
    }
  }
}
