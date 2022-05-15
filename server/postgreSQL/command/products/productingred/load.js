export async function load(pool, req, tabname, timezone, idOne) {
  // table productingred
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  if (!req.body?.products_id) {
    return {
      error: "Не хватает данных " + tabname,
    };
  }
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
      ${tabname}.proportion_b,
      ${tabname}.description,
      ${tabname}.user_id,
      ${tabname}.user_date,
      ${tabname}.meta,
      -- ну участвует concat(productvid.name,' ',productvid.nameext,', ',products.name,' (',products.massa,')') AS name,
      CASE WHEN ${tabname}.is_raw = TRUE THEN
              productraw.name
           ELSE
              concat(productvidchild.name,' ',productvidchild.nameext,', ',productschild.name,' (',productschild.massa,')')
           END
           AS name
      -- COALESCE(
      --   concat(productvidchild.name,' ',productvidchild.nameext,', ',productschild.name,' (',productschild.massa,')'),
      --   productraw.name) AS name

      FROM ${tabname}
      -- ну участвует LEFT JOIN  products ON products.id = ${tabname}.products_id -- для основного продукта
      -- ну участвует LEFT JOIN  productvid ON productvid.id = products.productvid_id  -- часть от основного продукта
      LEFT JOIN  products as productschild ON productschild.id = ${tabname}.products_id_child  -- для вставленного продукта
      LEFT JOIN  productvid as productvidchild ON productvidchild.id = productschild.productvid_id -- часть от вставленного продукта
      LEFT JOIN  productraw ON productraw.id = ${tabname}.productraw_id -- часть от вставленного продукта
      WHERE ${tabname}.products_id = $1
      ORDER BY name
`,
    values: [req.body?.products_id],
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
