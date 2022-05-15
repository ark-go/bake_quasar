import { pool } from "../initPostgreSQL.js";

export async function catalogUpdate(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let newData = req.body?.newData;
  let newLabel = newData.name;
  let meta = {
    isRaw: newData?.isRaw,
    isRecept: newData?.isRecept,
    prefArticle: newData?.prefArticle,
  };
  let newValue = req.body?.newValue;
  let tableName = req.body?.tableName;
  //let newLabel = req.body?.newLabel;
  let userId = req?.session?.user?.id;
  // userId = userId ? userId : 0;
  console.log("catalog update", newValue, newLabel, userId, meta);
  let sqlP = {
    text: /*sql*/ `
    UPDATE ${tableName} SET 
    "name" = $2,
    "user_id" = $3,
    "meta" = $4
    WHERE "id" = $1;
    `,
    values: [newValue, newLabel, userId, meta],
  };

  try {
    let result = await pool.query(sqlP);
    //  console.log("CatalogAdd", result);
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      message: result.rowCount > 0 ? "Обновлено." : "обновлено?",
    };
  } catch (err) {
    console.log(`Ошибка catalogUpdate ${tableName}`, err.toString());
    return {
      error: err.toString(),
    };
  }
}
