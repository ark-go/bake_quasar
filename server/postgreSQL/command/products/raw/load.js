export async function load(pool, req, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      ${tabname}.fullname,
      ${tabname}.unit_id,
      unit.name AS unit_name,
      ${tabname}.productrawvid_id,
      productrawvid.name AS productrawvid_name,
      ${tabname}.description,
      ${tabname}.article_buh,
      productrawvid.prefix || '-' ||${tabname}.article AS article,
      -- -- -- -- 
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  unit ON unit.id = ${tabname}.unit_id
      LEFT JOIN  productrawvid ON productrawvid.id = ${tabname}.productrawvid_id
      ${wher}
      ORDER BY ${tabname}.name
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
