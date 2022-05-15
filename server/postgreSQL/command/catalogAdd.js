import { pool } from "../initPostgreSQL.js";

export async function catalogAdd(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let tableName = req.body?.tableName;
  let newData = req.body?.newData;
  let newLabel = newData.name;
  // delete newData.name;
  let meta = {
    isRaw: newData?.isRaw,
    isRecept: newData?.isRecept,
    prefArticle: newData?.prefArticle,
  };
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO ${tableName}(name,user_id,meta)
    VALUES ($1, $2, $3::jsonb);
    `,
    values: [newLabel, userId, meta],
  };

  try {
    let result = await pool.query(sqlP);
    //  console.log("CatalogAdd", result);
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      message: result.rowCount > 0 ? "Добавлено." : "добавлено?",
    };
  } catch (err) {
    console.log(`Ошибка CatalogAdd ${tableName}`, err.toString());
    return {
      error: err.toString(),
    };
  }
}
