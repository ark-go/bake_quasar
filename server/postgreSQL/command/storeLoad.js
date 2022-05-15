import { pool } from "../initPostgreSQL.js";

export async function storeLoad(req, res) {
  let sqlP = {
    text: /*sql*/ `
    select * FROM stores
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
    console.log("Ошибка чтения stores", err.toString());
    return {
      error: err.toString(),
    };
  }
}
