import { pool } from "../../initPostgreSQL.js";

export async function selectPartnerRegistr() {
  let sqlP = {
    rowMode: "array", //!
    name: "selectPartnerRegistr",
    text: /*sql*/ `
    SELECT typeregistracion
FROM partners
GROUP BY typeregistracion;
`,
    values: [],
  };

  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    console.log("selectPartnerRegistr: ", res);
    // console.log(
    //   "groupNomenclName: ",
    console.log(res.map((field) => field[0]));
    // );
    return {
      data: res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки selectPartnerRegistr", err);
    return {
      error: "Ошибка при полчении списка selectPartnerRegistr",
    };
  }
}
//groupNomenclName();
