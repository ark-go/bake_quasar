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
      ${tabname}.productvid_id,
      concat(producttype.prefix,' ',productassortment.name,' ',productvid.name,' ',productvid.nameext) AS own_name,
      ${tabname}.article,
      ${tabname}.price_name,
      ${tabname}.cena,
      ${tabname}.description
      -- -- -- -- 
      FROM ${tabname}
      LEFT JOIN  docprice ON docprice.id = ${tabname}.docprice_id
      LEFT JOIN  productvid ON productvid.id = ${tabname}.productvid_id
      LEFT JOIN  productassortment ON productassortment.id = productvid.productassortment_id
      LEFT JOIN  producttype ON producttype.id = productassortment.producttype_id
      
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
