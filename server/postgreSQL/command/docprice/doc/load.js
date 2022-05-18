export async function load(pool, req, tabname, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let limit = "";
  if (req.body?.dateRange && !idOne) {
    wher = "WHERE datestart >= $2 AND datestart <  $3";
  } else if (!idOne) {
    wher = "";
    limit = "LIMIT 100";
  }
  //console.log(">>>>>>>>", idOne);
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name,
      to_char(${tabname}.datestart at time zone $1,  'DD.MM.YYYY') as "datestart",
      ${tabname}.docnum,
      ${tabname}.kagent_tm_id,
      kagent.name AS kagent_name,
      ${tabname}.docpricevid_id,
      docpricevid.name AS docpricevid_name,
      (select count(*) from docbakery where docbakery.docprice_id = ${tabname}.id ) AS bakery_count,
      ${tabname}.description,
      -- -- -- -- 
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  kagent_tm ON kagent_tm.id = ${tabname}.kagent_tm_id
      LEFT JOIN  kagent ON kagent.id = kagent_tm.kagent_id
      LEFT JOIN  docpricevid ON docpricevid.id = ${tabname}.docpricevid_id
      ${wher}
      ORDER BY ${tabname}.datestart DESC,kagent_name,docnum
      ${limit}
`,
    values: [req.session.timezone],
  };
  if (idOne) sqlP.values = [req.session.timezone, idOne];
  if (req.body?.dateRange && !idOne) {
    sqlP.values = [
      req.session.timezone,
      req.body.dateRange?.from, // && new Date(req.body.dateRange.from),
      req.body.dateRange.to, // && new Date(req.body.dateRange.to),
    ];
  }
  // console.log(sqlP);
  // console.log(req.body);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //console.log("load", result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка load.js ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
