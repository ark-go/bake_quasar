import { load } from "./load.js";

export async function update(pool, req, tabname) {
  let id = req.body?.id;
  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      docprice_id = $2,
      products_id = $3,
      article = $4,
      price_name = $5,
      cena = $6,
      description = $7,
      user_id = $8,
      user_date = CURRENT_TIMESTAMP,
      meta = $9
      
      WHERE "id" = $1
      RETURNING *;

      `,
    values: [
      id,
      req.body.docprice_id,
      req.body.products_id,
      req.body.article,
      req.body.price_name,
      req.body.cena,
      req.body.description,
      req.session.user.id,
      req.body.meta || {},
    ],
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
