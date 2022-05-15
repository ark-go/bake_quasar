export async function del(pool, req, tabname, timezone) {
  if (!req.body?.id) {
    return {
      error: "Не хватает данных.",
    };
  }
  let id = req.body.id;

  let sqlP = {
    text: /*sql*/ `
    DELETE FROM ${tabname}
      WHERE "id" = $1
    RETURNING *;

      `,
    values: [id],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Delete ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
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
