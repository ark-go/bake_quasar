import { pool } from "../initPostgreSQL.js";

export async function catalogsLoad() {
  let sqlP = {
    text: /*sql*/ `
    select "name" as label, "catalog" as value,catalog_h,prim,meta FROM catalogs
    order by "name"
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
    console.log("Ошибка чтения catalogsLoad", err.toString());
    return {
      error: err.toString(),
    };
  }
}
