//import { load } from "./load.js";

export async function update(pool, req, tabname, timezone) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      select ingredient_update($1::BIGINT,$2::BIGINT,$3::BOOLEAN,$4::BIGINT,$5::BIGINT,$6::NUMERIC,$7::NUMERIC,
                          $8::NUMERIC,$9::CITEXT,$10::BIGINT,CURRENT_TIMESTAMP,$11::jsonb);
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
