import { pool } from "../../initPostgreSQL.js";
import { update } from "./update.js";
import { load } from "./load.js";

export async function updateDocument(req, res, tabname, timezone) {
  let docnum = req.body?.docnum && req.body.docnum.trim();

  if (!docnum || !req.body.id) {
    return {
      error: "Не хватает данных.",
    };
  }

  let sqlP = {
    text: /*sql*/ `
      update price set
      datestart = $1, 
      trademark_id = $2, 
      kagent_id = $3, 
      kagent_own_id = $4, 
      docnum = $5, 
      pricevid_id = $6, 
      description = $7, 
      meta = $8, 
      user_id = $9
      where id = $10
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
      req.body.id,
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
    console.log("Ошибка обновления price ", err.toString());
    return {
      error: err.toString(),
    };
  }
}
