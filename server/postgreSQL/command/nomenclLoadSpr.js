import { pool } from "../initPostgreSQL.js";

export async function nomenclLoadSpr() {
  let sqlP = {
    text: /*sql*/ `
    select "id" as value,"name" as label, "name_ext", "meta" FROM vidnomencl
    order by "name";
    select "id" as value,"name" as label, "name_ext", "meta" FROM groupraw
    order by "name";
    select "id" as value,"name" as label, "name_ext", "meta" FROM vidraw
    order by "name";
    select "id" as value,"name" as label, "name_ext", "meta" FROM unit
    order by "name";
`,
    values: [],
  };

  try {
    let result = await pool.query(sqlP);
    // console.log(">>", result);
    // result = result.rowCount > 0 ? result.rows : null;
    return {
      vidnomencl: result[0].rows,
      groupraw: result[1].rows,
      vidraw: result[2].rows,
      unit: result[3].rows,
    };
  } catch (err) {
    console.log("Ошибка чтения nomenclLoadSpr", err.toString());
    return {
      error: err.toString(),
    };
  }
}

//console.log((await nomenclLoadSpr()).unit);
