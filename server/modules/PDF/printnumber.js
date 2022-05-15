import { pool } from "../../postgreSQL/initPostgreSQL.js";

export async function printnumber() {
  try {
    let result = await pool.query("select nextval('printnumber')");

    return result.rows[0].nextval;
  } catch (err) {
    console.log("err nextval", err.toString());
    return "-";
  }
}
