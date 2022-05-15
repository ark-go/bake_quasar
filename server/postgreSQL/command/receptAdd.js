import { pool } from "../initPostgreSQL.js";

export async function receptAdd(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let nameRecept = req.body?.nameRecept.trim();
  let nomenclId = req.body?.nomenclId;

  if (!nameRecept || !nomenclId) {
    return {
      error: "Не достаточно данных.",
    };
  }

  // delete newData.name;
  let meta = {};
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO recept("nomencl_id","name","user_id","meta")
    VALUES ($1, $2, $3, $4::jsonb)
    RETURNING id,"name";
    `,
    values: [nomenclId, nameRecept, userId, meta],
  };

  try {
    let result = await pool.query(sqlP);

    //  console.log("ReceptAdd", result);
    let newIdRecept = result.rows[0].id;
    let newNameRecept = result.rows[0].name;
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      message: result.rowCount > 0 ? "Добавлен рецепт." : "добавлено, рецепт?",
      newIdRecept: newIdRecept,
      newNameRecept: newNameRecept,
    };
  } catch (err) {
    console.log(`Ошибка ReceptAdd `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
