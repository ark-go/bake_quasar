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
  let productvid = {
    text: /*sql*/ `
            SELECT
            id,
            concat(name,' ',nameext) AS name
            --name
            FROM productvid
            ORDER BY name
      `,
  };

  let allSprav = {};
  try {
    // let result = await pool.query(unit);
    // result = result.rowCount > 0 ? result.rows : null;
    // allSprav.unit = result;

    let result = await pool.query(productvid);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.productvid = result;
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
