import { load } from "./load.js";

export async function update(pool, req, tabname) {
  let id = req.body?.id;

  let sqlP = {
    text: /*sql*/ `
      UPDATE ${tabname} SET
      docpricevid_id = $2,
      docnum = $3,
      name = $4,
      kagent_tm_id = $5,
      datestart = $6,
      description = $7,
      meta = $8,
          user_id = $9,
          user_date = CURRENT_TIMESTAMP
      WHERE "id" = $1
      RETURNING *;

      `,
    values: [
      id,
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
