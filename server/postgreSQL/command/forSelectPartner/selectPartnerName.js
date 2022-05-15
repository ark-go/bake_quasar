import { pool } from "../../initPostgreSQL.js";

export async function selectPartnerName() {
  let sqlP = {
    rowMode: "array", //!
    name: "selectPartnerName",
    text: /*sql*/ `
    SELECT partner
FROM partners
GROUP BY partner;
`,
    values: [],
  };

  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    console.log("selectPartnerName: ", res);
    // console.log(
    //   "groupNomenclName: ",
    console.log(res.map((field) => field[0]));
    // );
    return {
      data: res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки selectPartnerName", err);
    return {
      error: "Ошибка при полчении списка имен selectPartnerName",
    };
  }
}
//groupNomenclName();
