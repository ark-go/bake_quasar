import { pool } from "../initPostgreSQL.js";

export async function specstoreLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";

  let sqlP = {
    text: /*sql*/ `
      SELECT 
        specstore.id,  -- счетчик id магазина
        --store_id,        /* магазин ID */
        store.city || '/' || store.brandname AS store_name,
        doc_number,       /* номер документа Доп соглашение номер*/
        date_start, /* Дата начала дейсвия доп соглашения*/
        article_store, /* Артикул магазина в доп согл */
        --recept_id,       /* id  рецепта */
        recept.article AS article_firma,
        recept.nomencl_name || '/' || recept.name AS product,
        -- recept.name AS recept_name,
        cena,    /* цена лепешки */
        -- user_id,   /* наш пользователь*/
        users.email,
        user_date,     /* дата занесения - изменения*/
        specstore.meta
      FROM specstore
      LEFT JOIN  users ON users.id = specstore.user_id
      LEFT JOIN  store ON store.id = specstore.store_id
     -- LEFT JOIN  recept ON recept.id = specstore.recept_id
      LEFT JOIN  (
        SELECT recept.id,recept.article,nomencl_id,nomencl."name" as nomencl_name,recept.article as article_recept,recept."name" from recept,nomencl
        WHERE recept.nomencl_id = nomencl.id
          
      ) AS recept ON recept.id = specstore.recept_id
`,
    values: [],
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log(result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения specstoreLoad", err.toString());
    return {
      error: err.toString(),
    };
  }
}

//let m = await specstoreLoad();
//console.log(m.result);
