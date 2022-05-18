import { update } from "./update.js";
import { load } from "./load.js";

export async function add(pool, req, tabname) {
  if (req.body?.id) {
    return update(pool, req, tabname);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (docprice_id,productvid_id,article,price_name,cena,description,user_id,user_date,meta)
      VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP,$8)
      RETURNING *;

      `,
    values: [
      req.body.docprice_id,
      req.body.productvid_id,
      req.body.article,
      req.body.price_name,
      req.body.cena,
      req.body.description,
      req.session.user.id,
      req.body.meta || {},
    ],
  };

  // console.log(">>>", sqlP);

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    let mess = `Add ${tabname}:` + "\n" + req?.session?.user?.email;
    // console.log(mess, result);
    if (result && result.length > 0) {
      //   console.log("add req biody", req.body);
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
