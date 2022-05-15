import { load } from "./load.js";

export async function update(pool, req, tabname, timezone) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
          name = $2,
          nameext = $3,
          fullname = $4,
          unit_id = $5,
          producttype_id = $6,
          description = $7,
          user_id = $8,
          user_date = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING *;

      `,
    values: [
      id,
      req.body.name ? req.body.name.trim() : null,
      req.body.nameext ? req.body.nameext.trim() : null,
      req.body.fullname,
      req.body.unit_id,
      req.body.producttype_id,
      req.body.description,
      req?.session?.user?.id,
    ],
  };

  //  console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Update ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    if (result && result.length > 0) {
      return await load(pool, req, tabname, timezone, result[0]?.id);
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
