import { load } from "./load.js";

export async function update(pool, req, tabname) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      docprice_id = $2,
      bakery_id = $3,

      WHERE "id" = $1
      RETURNING *;

      `,
    values: [id, req.body.docprice_id, req.body.bakery_id],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    //  console.log(mess, result);
    if (result && result.length > 0) {
      return await load(pool, req, tabname, result[0]?.id);
    }
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
