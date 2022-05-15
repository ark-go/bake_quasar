import { load } from "./load.js";

export async function update(pool, req, tabname, timezone) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
          name = $2,
          prefix = $3,
          user_id = $4,
          user_date = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING *;

      `,
    values: [id, req.body.name, req.body.prefix, req?.session?.user?.id],
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
