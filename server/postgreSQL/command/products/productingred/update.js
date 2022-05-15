//import { load } from "./load.js";

export async function update(pool, req, tabname, timezone) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      products_id = $2,
      is_raw = $3,
      products_id_child = $4,
      productraw_id = $5,
      massbrutto = $6,
      massnetto = $7,
      massfinish = $8,
      description = $9,
      user_id = $10,
      user_date = CURRENT_TIMESTAMP,
      meta = $11
      WHERE "id" = $1
      --RETURNING *;

      `,
    values: [
      id,
      req.body.products_id,
      req.body.is_raw,
      req.body.products_id_child || null,
      req.body.productraw_id || null,
      req.body.massbrutto || null,
      req.body.massnetto || null,
      req.body.massfinish || null, //  req.body.article,
      req.body.description || "",
      req?.session?.user?.id,
      req.body.meta || {},
    ],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + req?.session?.user?.email;
    console.log(mess, result);
    // if (result && result.length > 0) {
    //   return await load(pool, req, tabname, timezone, result[0]?.id);
    // }
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка update ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
