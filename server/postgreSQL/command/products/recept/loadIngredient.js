export async function loadIngredient(pool, req, tabname, timezone, idOne) {
  // table productingred
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
      SELECT
      ${tabname}.id,
      ${tabname}.products_id,
      ${tabname}.is_raw,
      ${tabname}.products_id_child,
      ${tabname}.productraw_id,
      ${tabname}.massbrutto,
      ${tabname}.massnetto,
      ${tabname}.massfinish,
      ${tabname}.proportion,
      ${tabname}.description,
      ${tabname}.user_id,
      ${tabname}.user_date,
      ${tabname}.meta,
      -- ну участвует concat(productvid.name,' ',productvid.nameext,', ',products.name,' (',products.massa,')') AS name,
      COALESCE(
         concat(productassortment.name,'x ',productvidchild.name,'x ',productvidchild.nameext,' ',productschild.name,' (',productschild.massa,')'),
         productraw.name) AS name

      FROM ${tabname}
      -- ну участвует LEFT JOIN  products ON products.id = ${tabname}.products_id -- для основного продукта
      -- ну участвует LEFT JOIN  productvid ON productvid.id = products.productvid_id  -- часть от основного продукта
      LEFT JOIN  products as productschild ON productschild.id = ${tabname}.products_id_child  -- для вставленного продукта
      LEFT JOIN  productvid as productvidchild ON productvidchild.id = productschild.productvid_id -- часть от вставленного продукта
      LEFT JOIN  productassortment ON productassortment.id = productvidchild.productassortment_id
      ${wher}
      ORDER BY name
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
