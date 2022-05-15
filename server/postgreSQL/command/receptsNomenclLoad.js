import { pool } from "../initPostgreSQL.js";

export async function receptsNomenclLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  // let nameRecept = req.body?.nameRecept.trim();
  let nomenclId = req.body?.nomenclId;

  if (!nomenclId) {
    return {
      error: "Не достаточно данных.",
    };
  }

  // delete newData.name;
  let meta = {};
  let userId = req?.session?.user?.id;
  userId = userId ? userId : 0;
  let sqlP = {
    text: /*sql*/ `
    select nomencl_id,recept.id as recept_id, 
(select name from nomencl where id = nomencl_id) as nomencl_name,
recept.name as recept_name 
from recept
where nomencl_id = $1
order by nomencl_name
    `,
    values: [nomenclId],
  };

  try {
    let result = await pool.query(sqlP);

    //  console.log("ReceptAdd", result);
    // let newIdRecept = result.rows[0].id;
    //result = result.rowCount > 0 ? "Добавлено." : null; // command: 'iNSERT'
    return {
      message: result.rowCount > 0 ? result.rows : "??",
      // newIdRecept: newIdRecept,
    };
  } catch (err) {
    console.log(`Ошибка ReceptAdd `, err.toString());
    return {
      error: err.toString(),
    };
  }
}
