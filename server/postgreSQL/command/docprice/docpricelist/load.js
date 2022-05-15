export async function load(pool, req, tabname, idOne) {
  let wher = "";
  if (idOne) {
    wher = "docpricelist.id = $1";
  } else {
    wher = "docpricelist.docprice_id = $1";
  }

  // }
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";

  // docpricelist table
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.docprice_id,
      ${tabname}.products_id,
      concat(productvid.name,' ',products.name,' (',products.massa,') TTK№',products.document_num) AS own_name,
      ${tabname}.article,
      ${tabname}.price_name,
      ${tabname}.cena,
      ${tabname}.description
      -- -- -- -- 
      FROM ${tabname}
      LEFT JOIN  docprice ON docprice.id = ${tabname}.docprice_id
      LEFT JOIN  products ON products.id = ${tabname}.products_id
      LEFT JOIN  productvid ON productvid.id = products.productvid_id
      
      WHERE ${wher}
      
      ORDER BY price_name,own_name
      --{limit}
`,
    values: [],
  };
  if (idOne) sqlP.values = [idOne];
  else sqlP.values = [req.body.docprice_id];

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
