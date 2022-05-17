import { update } from "./update.js";
import { load } from "./load.js";

export async function add(pool, req, tabname, timezone) {
  let name = req.body?.name && req.body.name.trim();
  if (!name) {
    return {
      error: "Не хватает данных.",
    };
  }
  console.log("FFFFFFF");
  if (req.body?.id) {
    return update(pool, req, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (name,producttype_id,prefix)
      VALUES ($1,$2,$3)
      RETURNING *;

      `,
    values: [
      req.body.name ? req.body.name.trim() : null,
      req.body.producttype_id,
      req.body.prefix,
    ],
  };

  // console.log(">>>", sqlP);

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
