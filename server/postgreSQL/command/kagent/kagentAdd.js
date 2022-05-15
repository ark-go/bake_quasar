import { pool } from "../../initPostgreSQL.js";

export async function kagentAdd(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  console.log("kagentAdd", JSON.stringify(req.body));

  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO kagent 
    (name,franchising,owncompany,inn,vidreg_id,meta,user_id,user_date)
    VALUES ($1, $2, $3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
    RETURNING id,name,franchising,owncompany,inn,vidreg_id, meta;
    `,
    values: [
      req.body.name && req.body.name.trim(),
      req.body.franchising,
      req.body.owncompany,
      req.body.inn && req.body.inn.trim(),
      req.body.vidreg_id,
      req.body.meta || {},
      userId,
    ],
  };

  try {
    let result = await pool.query(sqlP);
    // console.log("CatalogAdd", result);
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    if (result.rowCount > 0) {
      return {
        result: result.rows[0],
      };
    } else {
      return {
        error: "Ни чего не добавилось", //result.rowCount > 0 ? "Добавлено." : "добавлено?",
      };
    }
  } catch (err) {
    console.log(`Ошибка kagentAdd `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
