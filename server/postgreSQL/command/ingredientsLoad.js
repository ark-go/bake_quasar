import { pool } from "../initPostgreSQL.js";
// читаем список ингредиентов для одного рецепта, читаем состав рецепта
export async function ingredientsLoad(req, res) {
  let sqlP = "";
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  try {
    let receptId = req.body?.receptId.trim();

    if (!receptId) {
      return {
        error: "Не достаточно данных.",
      };
    }

    let meta = {};
    let userId = req?.session?.user?.id;
    userId = userId ? userId : 0;
    sqlP = {
      text: /*sql*/ `
   -- SELECT * FROM ingredient
   -- WHERE recept_id = $1
   SELECT 
   i.id,                  -- id этой таблицы для управления
   CASE
      WHEN i.recept_idx is not null THEN r2.article
      ELSE n.article 
   END 
    AS article,
   -- r.nomencl_id,             -- к какой номенклатуре принадлежит 
   -- n1.name as nomencl_name1, -- название номенклатуры к которой принадлежит рецепт
   -- r.name as recept_name,    -- рецепт название этого рецепта. все к этому рецепту
   -- n.name as nomencl_name,   -- номенклатура вошедшая в рецепт
   -- i.recept_idx as recept_idx, -- рецепт к номенклатуре которая вошла в рецепт
   -- r2.name as recept_name2,   -- название рецепта если указана номенклатура с рецептом
   CASE
      WHEN i.recept_idx is not null THEN n.name ||'/'|| r2.name
      ELSE n.name 
   END 
    AS nameingredient,         -- название ингредиента, если у номенклатуры есть рецепт то объединяется
    CAST(to_char(i.brutto, 'FM9999999999999990.9999') AS NUMERIC) as brutto, -- отрезаем нули
    CAST(to_char(i.netto,  'FM9999999999999990.9999') AS NUMERIC) as netto, -- отрезаем нули
    CAST(to_char(i.itogo,  'FM9999999999999990.9999') AS NUMERIC) as itogo, -- отрезаем нули
   -- i.brutto as brutto,
   -- i.netto as netto,
   -- i.itogo as itogo,
  i.comment as "comment"
  -- *
  
  FROM ingredient as i
   LEFT JOIN recept r 
   ON i.recept_id = r.id
   LEFT JOIN nomencl n
   ON i.nomencl_id = n.id
   LEFT JOIN nomencl n1
   ON r.nomencl_id = n1.id
   LEFT JOIN recept r2
   ON i.recept_idx = r2.id
   WHERE i.recept_id = $1
    `,
      values: [receptId],
    };
  } catch (err) {}
  try {
    let result = await pool.query(sqlP);

    //  console.log("ReceptAdd", result);
    // let newIdRecept = result.rows[0].id;
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      message: result.rowCount > 0 ? result.rows : "",
    };
  } catch (err) {
    console.log(`Ошибка ingredientsLoad `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
