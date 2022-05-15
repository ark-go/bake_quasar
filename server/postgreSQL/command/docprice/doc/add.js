import { update } from "./update.js";
import { load } from "./load.js";

export async function add(pool, req, tabname) {
  let name = req.body?.name && req.body.name.trim();
  if (!name) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (req.body?.id) {
    return update(pool, req, tabname);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO ${tabname} (docpricevid_id,docnum,name,kagent_tm_id,datestart,description,meta, user_id, user_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
      RETURNING *;

      `,
    values: [
      req.body.docpricevid_id,
      req.body.docnum,
      req.body.name || "",
      req.body.kagent_tm_id,
      req.body.datestart,
      req.body.description || "",
      req.body.meta || {},
      req?.session?.user?.id,
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
