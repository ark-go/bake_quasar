export async function loadProducts(pool, req, tabname, idOne) {
  //   let wher = "";
  //   if (idOne) {
  //     wher = "docprice.id = $1";
  //   } else {
  //     wher = "docprice.docprice_id = $1";
  //   }

  // }
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";

  // products table
  let sqlP = {
    text: /*sql*/ `
        SELECT
        ${tabname}.id,
        concat(productvid.name,' ',productvid.nameext,' ',products.name,' (',products.massa,') TTK№',products.document_num) AS name, 
        ${tabname}.article
        -- -- -- -- 
        FROM ${tabname}
        LEFT JOIN  productvid ON productvid.id = ${tabname}.productvid_id
        --WHERE {wher}
        
        ORDER BY name
        --{limit}
  `,
    values: [],
  };
  //   if (idOne) sqlP.values = [idOne];
  //   else sqlP.values = [req.body.docprice_id];

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
