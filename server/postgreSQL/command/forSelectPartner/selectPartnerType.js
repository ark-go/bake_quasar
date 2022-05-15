import { pool } from "../../initPostgreSQL.js";

export async function selectPartnerType() {
  let sqlP = {
    rowMode: "array", //!
    name: "selectPartnerType",
    text: /*sql*/ `
    SELECT typepartner
FROM partners
GROUP BY typepartner;
`,
    values: [],
  };

  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    console.log("selectPartnerType: ", res);
    // console.log(
    //   "groupNomenclName: ",
    console.log(res.map((field) => field[0]));
    // );
    return {
      data: res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки selectPartnerType", err);
    return {
      error: "Ошибка при полчении списка selectPartnerType",
    };
  }
}
//groupNomenclName();
