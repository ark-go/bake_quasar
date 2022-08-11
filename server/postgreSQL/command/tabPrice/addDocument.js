import { pool } from "../../initPostgreSQL.js";
import { updateDocument } from "./updateDocument.js";
import { load } from "./load.js";

export async function addDocument(req, res, tabname, timezone) {
  let docnum = req.body?.docnum && req.body.docnum.trim();
  if (!docnum) {
    return {
      error: "Не хватает данных.",
    };
  }

  if (req.body?.id) {
    return updateDocument(req, res, tabname, timezone);
  }

  let sqlP = {
    text: /*sql*/ `
      INSERT INTO price (datestart, trademark_id, kagent_id, kagent_own_id, docnum, pricevid_id, description, meta, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;

      `,
    values: [
      req.body.datestart,
      req.body.trademark_id,
      req.body.kagent_id,
      req.body.kagent_own_id,
      docnum,
      req.body.pricevid_id,
      req.body.description || "",
      req.body.meta || {},
      req?.session?.user?.id || null,
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
      return await load(req, res, tabname, timezone, result[0]?.id);
      //   return await load(pool, req, tabname, result[0]?.id);
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
