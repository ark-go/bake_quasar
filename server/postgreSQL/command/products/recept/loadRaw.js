export async function loadRaw(pool, req, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.is_raw,
      ${tabname}.name,
      productrawvid.name AS info, -- молочное мясное
      ${tabname}.description

      --concat(${tabname}.name,' ', ${tabname}.fullname) AS name,
      --unit.name AS unit_name,
      --productrawvid.name AS productrawvid_name, -- молочное мясное
      --productrawvid.prefix || '-' ||${tabname}.article AS article
      -- -- -- -- 
      FROM ${tabname}
      -- LEFT JOIN  unit ON unit.id = ${tabname}.unit_id
      LEFT JOIN  productrawvid ON productrawvid.id = ${tabname}.productrawvid_id
      ${wher}
      ORDER BY ${tabname}.name
`,
    values: [],
  };
  if (idOne) sqlP.values = [timezone, idOne];
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
