import { update } from "./update.js";
//import { load } from "./load.js";

export async function add(pool, req, tabname, timezone) {
  // let name = req.body?.name && req.body.name.trim();
  // if (!name) {
  //   return {
  //     error: "Не хватает данных.",
  //   };
  // }
  console.log("productingred add upd-body:", req.body);
  if (req.body?.id) {
    return update(pool, req, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (
      products_id, is_raw,products_id_child,productraw_id,
      massbrutto,massnetto,massfinish,description, user_id, user_date, meta)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP,$10)
      -- RETURNING *;

      `,
    values: [
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

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    console.log(mess, result);
    // if (result && result.length > 0) {
    //   return await load(pool, req, tabname, timezone, result[0]?.id);
    // }
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка добавления ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
