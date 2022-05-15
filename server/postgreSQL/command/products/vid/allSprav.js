export async function allSprav(pool, req, tabname, timezone) {
  let unit = {
    text: /*sql*/ `
            SELECT
            id,
            name
            FROM unit
            ORDER BY name
      `,
  };
  let producttype = {
    text: /*sql*/ `
            SELECT
            id,
            name
            FROM producttype
            ORDER BY name
      `,
  };

  let allSprav = {};
  try {
    let result = await pool.query(unit);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.unit = result;

    result = await pool.query(producttype);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.producttype = result;
    return {
      result: allSprav,
    };
  } catch (err) {
    console.log("Ошибка чтения справочников для: ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
