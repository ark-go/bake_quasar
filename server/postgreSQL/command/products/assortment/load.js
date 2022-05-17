export async function load(pool, req, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $1" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      ${tabname}.producttype_id,
      producttype.name AS producttype_name,
      ${tabname}.prefix
      -- -- -- -- 
      FROM ${tabname}

      LEFT JOIN  producttype ON producttype.id = ${tabname}.producttype_id
      ${wher}
      ORDER BY ${tabname}.name
`,
    values: [],
  };
  if (idOne) sqlP.values = [idOne];
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //  console.log("sprav load", tabname, result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
