export async function allSprav(pool, req, tabname) {
  let kagent_tm = {
    text: /*sql*/ `
            SELECT
            --kagent.id As id,
            kagent_tm.id As id,   
            kagent.name AS kagent_name,
            trademark.name AS trademark_name,
            concat(kagent.name,' (',trademark.name, ')') AS name
            FROM kagent_tm
            LEFT JOIN kagent ON kagent.id = kagent_tm.kagent_id
            LEFT JOIN trademark ON trademark.id = kagent_tm.trademark_id
            ORDER BY kagent_name,trademark_name
      `,
  };
  let docpricevid = {
    text: /*sql*/ `
            SELECT
            id,
            name
            FROM docpricevid
            ORDER BY name
      `,
  };

  let allSprav = {};
  try {
    let result = await pool.query(kagent_tm);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.kagent_tm = result;
    result = await pool.query(docpricevid);
    result = result.rowCount > 0 ? result.rows : null;
    allSprav.docpricevid = result;
    return {
      result: allSprav,
    };
  } catch (err) {
    console.log(
      "Ошибка чтения справочников для Документов цен: ",
      err.toString()
    );
    return {
      error: err.toString(),
    };
  }
}
