export async function load(pool, req, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      ${tabname}.massa,
      -- ${tabname}.unit_id,
      -- unit.name AS unit_name,
      unit.name AS unit_name,
      ${tabname}.productvid_id,
      concat(productassortment.name,' ',productvid.name,' ',productvid.nameext) AS productvid_name,
      productassortment.prefix AS prefix,
      ${tabname}.description,
      ${tabname}.document_num,
      -- ${tabname}.document_date,
      to_char(${tabname}.document_date,  'DD.MM.YYYY') as document_date,
      ${tabname}.article_buh,
      'PR-' ||${tabname}.article AS article,
      -- -- -- -- 
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      
      LEFT JOIN  productvid ON productvid.id = ${tabname}.productvid_id
      LEFT JOIN  productassortment ON productassortment.id = productvid.productassortment_id
      LEFT JOIN  unit ON unit.id = productvid.unit_id
    -- LEFT JOIN  productassortment ON productassortment.id = productvid.productassortment_id
       ${wher}
      ORDER BY productassortment.name, productvid.name,productvid.nameext, ${tabname}.name
`,
    values: [timezone],
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
