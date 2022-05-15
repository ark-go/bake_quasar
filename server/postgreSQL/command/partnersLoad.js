import { pool } from "../initPostgreSQL.js";


export async function partnersLoad() {
  let sqlP = {
    text: /*sql*/ `
    select * FROM partners
`,
    values: [],
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;

    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения partners", err.toString());
    return {
      error: err.toString(),
    };
  }
}
