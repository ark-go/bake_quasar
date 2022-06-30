export async function loadSprav(pool, req, tabname, idOne) {
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  // let limit = "";
  // if (req.body?.dateRange && !idOne) {
  //   wher = "WHERE datestart >= $2 AND datestart <  $3";
  // } else if (!idOne) {
  //   wher = "";
  //   limit = "LIMIT 100";
  // }
  //console.log(">>>>>>>>", idOne);

  // bakery table
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.name AS bakery_name,
      concat(${tabname}.name,' (',city.name,')') AS name,
      -- concat(${tabname}.name,' ',kagent.name,' ',city.name) AS name,
      kagent.name AS kagent_tm_name,
      trademark.name AS trademark_name,
      territory.name AS territory_name,
      region.name AS region_name,
      city.name AS city_name,
      ${tabname}.description,
      -- -- -- -- 
      users.email AS "user_email",
      to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
      ${tabname}.meta
      FROM ${tabname}
      LEFT JOIN  users ON users.id = ${tabname}.user_id
      LEFT JOIN  kagent_tm ON kagent_tm.id = ${tabname}.kagent_tm_id
      LEFT JOIN  kagent ON kagent.id = kagent_tm.kagent_id
      LEFT JOIN  trademark ON trademark.id = ${tabname}.trademark_id
      LEFT JOIN  city ON city.id = ${tabname}.city_id
      LEFT JOIN  territory ON territory.id =  ${tabname}.territory_id
      LEFT JOIN  region ON region.id = ${tabname}.region_id
      WHERE ${tabname}.kagent_tm_id = $2
      AND  NOT (bakery.id = ANY ( select bakery_id from docbakery where docbakery.docprice_id = $3))
      --LEFT JOIN  docpricevid ON docpricevid.id = ${tabname}.docpricevid_id
      --{wher}
      ORDER BY ${tabname}.name
      --{limit}
`,
    values: [req.session.timezone, req.body.kagent, req.body.docpriceid],
  };
  // if (idOne) sqlP.values = [req.session.timezone, idOne];
  // if (req.body?.dateRange && !idOne) {
  //   sqlP.values = [
  //     req.session.timezone,
  //     req.body.dateRange?.from, // && new Date(req.body.dateRange.from),
  //     req.body.dateRange.to, // && new Date(req.body.dateRange.to),
  //   ];
  // }
  // console.log(sqlP);
  // console.log(req.body);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //   console.log("load", tabname, result, idOne);
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
