import { pool } from "../initPostgreSQL.js";

export async function groupNomenclName(req, res) {
  let sqlP = {
    rowMode: "array", //!
    name: "groupNomenclName",
    text: /*sql*/ `
    SELECT nomenclature
FROM nomenclature
GROUP BY nomenclature;
`,
    values: [],
  };

  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    //    console.log(res.map((field) => field[0]));
    // );
    return {
      data: res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки номенклатуры", err);
    return {
      error: "Ошибка при полчении списка имен номенклатуры",
    };
    return false;
  }
}
// groupNomenclName();
