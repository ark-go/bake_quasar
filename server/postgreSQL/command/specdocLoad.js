import { pool } from "../initPostgreSQL.js";
import escape from "pg-escape";
export async function specdocLoad(req, res) {
  let timezone = req?.headers?.timezone
    ? req.headers.timezone
    : "Europe/Moscow";
  let isChilds = req?.body?.isChilds;
  let rowData = req?.body?.rowData;
  //! звать санитаров срочно
  let groupby = req?.body?.groupby;
  // if (!groupby) {
  //   return {
  //     error: "Нет данных группы",
  //   };
  // }
 // console.log("пришло", groupby);
  let columnSelect = "";
  let columnGroup = "";
  let queryGroup = "";

  let itemValue = {
    date_start: `specdoc.date_start!to_char(specdoc.date_start,  'DD.MM.YYYY') as "date_start"`,
    doc_number: "specdoc.doc_number!specdoc.doc_number AS doc_number",
    store_id: "store.id!store.id AS store_id",
    store_city: `store.city!store.city AS store_city`,
    store_street: `store.street!store.street AS store_street`,
    city: "store.city!store.city AS city",
    street: "store.street!store.street AS street",
    region: "store.region!store.region AS region",
    territory: "store.territory!store.territory AS territory",
    brandname: "store.brandname!store.brandname AS brandname",
    distributing: "store.distributing!store.distributing AS distributing",
  };
  if (groupby) {
    if (!!groupby.length) {
      if (isChilds) {
        groupby.unshift("store_id"); //!!
      }
      columnSelect = [];
      columnGroup = [];
      groupby.forEach((item) => {
        if (itemValue[item]) {
          let buf = itemValue[item].split("!");
          columnGroup.push(buf[0]);
          columnSelect.push(buf[1]);
        }
      });
      columnGroup = columnGroup.join(",");
      columnSelect = columnSelect.join(",");
     // console.log("selectGroup2:", columnSelect);
     // console.log("selectGroup2:", columnGroup);

      // lengthGr += columnRequery.length; // меняем кол-во %I для escape фильтра
      // selectGroup = Array(lengthGr).fill("%I").join(); // массив в строку через запятую
      // selectGroup = escape(selectGroup, ...columnRequery, ...req.body.groupby); // разворачиваем массив и пропускаем через фильтр Escape

      queryGroup =
        "SELECT ROW_NUMBER() over() as rowid" +
        "," +
        columnSelect +
        ", COUNT(*) AS count";

      queryGroup += `
        FROM specdoc
       LEFT JOIN  users ON users.id = specdoc.user_id
       LEFT JOIN  store ON store.id = specdoc.store_id
       WHERE specdoc.date_start >= CURRENT_DATE - INTERVAL '1' day * $1
      `;
      queryGroup += " GROUP BY " + columnGroup;
      console.log("ESCAPE2: ", queryGroup);
    }
  }

  let selectNogroup = /*sql*/ `
       SELECT 
       specdoc.id AS id,  -- счетчик id
       --store_id,        /* магазин ID */
       store.city || '/' || store.street AS store_name,
       specdoc.doc_number AS doc_number,       /* номер документа Доп соглашение номер*/
       specdoc.date_start AS date_start, /* Дата начала дейсвия доп соглашения*/
       to_char(specdoc.date_start at time zone $1,  'DD.MM.YYYY') as "date_start",
       specdoc.prim AS prim,
       users.email AS user,
       specdoc.user_date AS user_date,     /* дата занесения - изменения*/
       to_char(specdoc.user_date at time zone $1,  'DD.MM.YYYY HH12:MI:SS') as "user_date",
       specdoc.meta AS meta,
       ( SELECT COUNT(*) FROM specdocvalue WHERE  specdoc.id = specdocvalue.specdoc_id ) AS countvalue
       FROM specdoc
       LEFT JOIN  users ON users.id = specdoc.user_id
       LEFT JOIN  store ON store.id = specdoc.store_id

`;
  //  selectGroup = "";
  let queryValue = [timezone];
  if (queryGroup) queryValue = [10]; // если группа то убираем значение (timezone) и ставим сколько отнять от даты
  // COUNT(*) AS ModelsCount
  let sqlP = {
    text: queryGroup || selectNogroup,
    values: queryValue,
  };

  if (isChilds) {
    let selectChildQuery = createSelectChildQuery(groupby, rowData, sqlP);
    sqlP.text = selectChildQuery;
    console.log("Запрос specdocload", sqlP);
    // return {
    //   result: [],
    // };
  }

  try {
    let result = await pool.query(sqlP);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("========", result);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения specdocLoad", err.toString());
    return {
      error: err.toString(),
    };
  }
}

function escapeFromArr(val) {}

function createSelectChildQuery(groupData, row, sqlP) {
  if (!row) {
    console.log("createSelectChild Query: нет данных группировки");
    return;
  }

  // console.log("запрос:", sqlP.text);
  console.log("пришла группа от клиента:", row);
  let wher = [];
  for (var key in row) {
    if (["rowid", "count"].includes(key)) continue;
    wher.push(key + " = '" + row[key] + "'");
  }
  wher = wher.join(" AND ");
  //wher = "WHERE " + wher;
  wher = " HAVING " + wher;
  console.log("запрос:", wher);
  //return sqlP.text + wher; // Здесь полный запрос для группировки
  let droupselect = sqlP.text + wher;
  let select = /*sql*/ `
  SELECT store.*,gr.count AS count 
  FROM store
  RIGHT JOIN (${droupselect}) gr
  ON store.id = gr.store_id
  --LEFT JOIN  specdoc ON store.id = specdoc.store_id
  `;
  return select;
  //let newSelect = "Select * From specdoc, (" + sqlP.text + ") as zp\n";
  //newSelect = newSelect + wher;
  //return newSelect;

  let query = "SELECT * FROM specdoc as sp, (" + sqlP.text + ") AS gr\n WHERE ";
  let tmp = [];
  groupby.forEach((item) => {
    tmp.push("sp." + item + " = gr." + item);
  });

  query += tmp.join(" AND ");

  return query;
  //  return groupby;
}
