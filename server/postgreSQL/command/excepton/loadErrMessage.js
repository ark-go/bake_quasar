export async function loadErrMessage(errorCode) {
  let sqlP = {
    text: /*sql*/ `
        SELECT
        message,
        messageaction
        FROM errormess
        WHERE errorname = $1
        ORDER BY ${tabname}.name
  `,
    values: [errorCode],
  };
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
