export async function loadProducts(pool, req, tabname, timezone, idOne) {
  // table products
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.is_raw,
      concat(productvid.name,' ',productvid.nameext,', ',${tabname}.name,' (',${tabname}.massa,')') AS name,
      concat('ТТК №',${tabname}.document_num) AS info,
      ${tabname}.description,
      ${tabname}.massbrutto,
      ${tabname}.massnetto,
      ${tabname}.massfinish
      FROM ${tabname},
      LEFT JOIN  productvid ON productvid.id = ${tabname}.productvid_id
       ${wher}
      ORDER BY productvid.name, productvid.nameext, ${tabname}.name
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
