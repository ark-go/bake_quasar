export async function load(pool, req, tabname, idOne) {
  let wher = "";
  if (idOne) {
    wher = "docbakery.id = $1";
  } else {
    wher = "docbakery.docprice_id = $1";
  }

  // }
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";

  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      bakery.name AS bakery_name,
      territory.name AS territory_name,
      ${tabname}.bakery_id AS bakery_id,
      kagent.name AS kagent_tm_name,
      trademark.name AS trademark_name,
      city.name AS city_name

      -- -- -- -- 
      FROM ${tabname}
      LEFT JOIN  bakery ON bakery.id = ${tabname}.bakery_id
      LEFT JOIN  territory ON territory.id = bakery.territory_id
      LEFT JOIN  kagent_tm ON kagent_tm.id = bakery.kagent_tm_id
      LEFT JOIN  kagent ON kagent.id = kagent_tm.kagent_id
      LEFT JOIN  trademark ON trademark.id = bakery.trademark_id
      LEFT JOIN  city ON city.id = bakery.city_id
      WHERE ${wher}
      -- {tabname}.docprice_id = $1
      --LEFT JOIN  docpricevid ON docpricevid.id = ${tabname}.docpricevid_id
      
      ORDER BY bakery.name
      --{limit}
`,
    values: [req.body.docprice],
  };
  if (idOne) sqlP.values = [idOne];

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
    //console.log("load", tabname, result, idOne);
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
