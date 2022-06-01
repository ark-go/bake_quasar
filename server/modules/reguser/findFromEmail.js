async function findFromEmail() {
  let tabname = "";
  let sqlP = {
    text: /*sql*/ `
          SELECT
          ${tabname}.id,
          ${tabname}.name,
          users.email AS "user_email",
          to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
          ${tabname}.meta,
          (SELECT '${tabname}' AS tab)
          FROM ${tabname}
          LEFT JOIN  users ON users.id = ${tabname}.user_id
          ORDER BY ${tabname}.name
    `,
    values: [timezone],
  };
}
