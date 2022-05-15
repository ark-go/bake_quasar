import { pool } from "../initPostgreSQL.js";

export async function catalogLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let name = req.body?.name;
  let isHistory = req.body?.isHistory;
  let resultatName = "";
  let resultatHistory = "";
  if (name) {
    resultatName = await loadCatalogFromName(name);
  } else {
    return {
      error: "Не указано название справочника",
    };
  }
  if (isHistory) {
    resultatHistory = await loadCatalogHistoryFromName(name + "_h", timezone); // история
  } else {
    return {
      result: "",
    };
  }
  return {
    result: resultatName,
    resultHistory: resultatHistory,
  };
}

async function loadCatalogFromName(nameCatalog) {
  let sqlP = {
    text: /*sql*/ `
        select "name" as label, "id" as value,meta FROM ${nameCatalog}
        where "deleted" IS NOT TRUE
    `,
    values: [],
  };

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    return {
      result: result,
    };
  } catch (err) {
    console.log(`Ошибка чтения ${nameCatalog}`, err.toString());
    return {
      error: err.toString(),
    };
  }
}
async function loadCatalogHistoryFromName(nameCatalog, timezone) {
  let sqlP = {
    text: /*sql*/ `
    --START TRANSACTION READ WRITE;
     -- set time zone 'America/Los_Angeles';
            select "name" as label, "id" as value,("date" at time zone $1) as "date",meta FROM ${nameCatalog};
     --       COMMIT;
        `,
    values: [timezone],
  };
  console.log("timeZone: ", timezone);
  try {
    let result = await pool.query(sqlP);
    // console.log("чтото тут ::", result);
    // result = result.length > 2 ? result[2] : result;
    result = result.rowCount > 0 ? result.rows : null;
    //console.log("чтото тут2 ::", result);
    return {
      result: result,
    };
  } catch (err) {
    console.log(`Ошибка чтения ${nameCatalog}`, err.toString());
    return {
      error: err.toString(),
    };
  }
}
