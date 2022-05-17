export async function pdfAll(pool, req, tabname, timezone, idOne) {
  let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  let sqlP = {
    text: /*sql*/ `
        SELECT
        row_number() OVER(ORDER BY productvid.name,productvid.nameext, ${tabname}.name) AS numstr, --  row_number()  выдаст номер до сортировки
        ${tabname}.id,
        concat(productvid.name,' ',productvid.nameext,' ', ${tabname}.name,', TTK№ ',${tabname}.document_num) AS name,
        --
        productvid.name AS prodname, -- Лепешка
        concat(productvid.name,' ',productvid.nameext) AS prodnameext, -- Лепешка узбекская
        ${tabname}.name AS prodnameextdop, -- 500гр
        concat('',${tabname}.document_num) AS prodttk, -- ТТК номер
        concat(${tabname}.name,', ','TTK№ ',${tabname}.document_num) AS prodnamedopttk, -- граммм + ttk
        productvid.nameext As nameextonly,
        productassortment.prefix AS prefix,
        --
        ${tabname}.massa,
        ${tabname}.massfinish,
       -- ${tabname}.unit_id,
       -- unit.name AS unit_name,
        unit.name AS unit_name,
        ${tabname}.productvid_id,
        productvid.name AS productvid_name,
        ${tabname}.description,
        ${tabname}.document_num,
        -- ${tabname}.document_date,
        to_char(${tabname}.document_date,  'DD.MM.YYYY') as document_date,
        ${tabname}.article_buh,
        'PR-' ||${tabname}.article AS article,
        -- -- -- -- 
        users.email AS "user_email",
        to_char(${tabname}.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
        ${tabname}.meta
        FROM ${tabname}
        LEFT JOIN  users ON users.id = ${tabname}.user_id
        
        LEFT JOIN  productvid ON productvid.id = ${tabname}.productvid_id
        LEFT JOIN  unit ON unit.id = productvid.unit_id
        LEFT JOIN  productassortment ON productassortment.id =productvid.productassortment_id
        ${wher}
        ORDER BY productvid.name,productvid.nameext, ${tabname}.name
  `,
    values: [timezone],
  };
  if (idOne) sqlP.values = [timezone, idOne];
  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    //  console.log("sprav load", tabname, result);
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
