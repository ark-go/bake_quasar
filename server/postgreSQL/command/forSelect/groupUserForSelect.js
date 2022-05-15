import { pool } from "../../initPostgreSQL.js";

export async function groupUserForSelect() {
  let sqlP = {
    //  rowMode: "array", //!
    name: "groupUserForSelect", // prepared for base
    text: /*sql*/ `
    SELECT id as "value", (u_fam || ' ' || email)  as "label"
FROM users
ORDER BY email;
`,
    values: [],
  };
  try {
    let res = await pool.query(sqlP);
    res = res.rows.length > 0 ? res.rows : null;
    return {
      data: res, //res.map((field) => field[0]),
    };
  } catch (err) {
    console.log("Ошибка группировки selectPartnerGroup", err);
    return {
      error: "Ошибка при полчении списка selectPartnerGroup",
    };
  }
}
// [ { label: 'BMW', value: 'car' }, { label: 'Samsung Phone', value: 'phone' } ]
//groupUserForSelect();
