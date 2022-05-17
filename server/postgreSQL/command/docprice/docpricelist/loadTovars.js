export async function loadTovars(pool, req, tabname, idOne) {
  //   let wher = "";
  //   if (idOne) {
  //     wher = "docprice.id = $1";
  //   } else {
  //     wher = "docprice.docprice_id = $1";
  //   }

  // }
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";

  // productvid table
  let sqlP = {
    text: /*sql*/ `
        SELECT
        ${tabname}.id,
        concat(producttype.prefix,' ',productassortment.name,' ',${tabname}.name,' ',${tabname}.nameext) AS name, 
        ${tabname}.article
        -- -- -- -- 
        FROM ${tabname}
        LEFT JOIN  productassortment ON productassortment.id = ${tabname}.assortment_id
        LEFT JOIN  producttype ON producttype.id = productassortment.producttype_id
        --WHERE {wher}
        
        ORDER BY producttype.prefix, productassortment.name, ${tabname}.name, ${tabname}.nameext, name
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
