import { pool } from "../../initPostgreSQL.js";

export async function selectPartnerGroup() {
  let sqlP = {
    rowMode: "array", //!
    name: "selectPartnerGroup",
    text: /*sql*/ `
    SELECT grouppartner
FROM partners
GROUP BY grouppartner;
`,
    values: [],
  };

  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    console.log("selectPartnerGroup: ", res);
    // console.log(
    //   "groupNomenclName: ",
    console.log(res.map((field) => field[0]));
    // );
    return {
      data: res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки selectPartnerGroup", err);
    return {
      error: "Ошибка при полчении списка selectPartnerGroup",
    };
  }
}
//groupNomenclName();
