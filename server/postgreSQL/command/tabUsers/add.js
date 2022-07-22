import { pool } from "../../initPostgreSQL.js";
import { updateStatus } from "./updateStatus.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
import escape from "pg-escape";
import { redisSetUserReload } from "../../../utils/redis/redisSetUserReload.js";

export async function add(req, res, tabname, timezone, idOne) {
  //  let wher = req.body?.region_id ? "WHERE " +  tabname + ".region_id = $2" : "";
  //let wher = "";
  // let dateend =
  //   "to_char(bt.date_start,  'DD.MM.YYYY') as date_start, to_char(bt.date_end,  'DD.MM.YYYY') as date_end,";

  // для загрузки только группы печек
  // console.log(req.body);
  //! table - users
  let sqlP = {
    text: /*sql*/ `
    INSERT INTO ${tabname} (email,u_name,u_fam,u_otch,rereg,  tree_id,user_id,description, user_date)
    VALUES ($1,$2,$3,$4,$5,
      CASE
        WHEN $6::bigint is not null THEN 
            $6::bigint
        ELSE 
            (select id from tree where meta -> 'forNewUser' = 'true' LIMIT 1 )
      END,  
      $7,
      $8,
      CURRENT_TIMESTAMP)
    RETURNING id;
`,
    values: [
      // req.body.id,
      req.body.email, //1
      req.body.user_name,
      req.body.user_fam, //3
      req.body.user_otch,
      req.body.rereg || false, //5
      req.body.tree_id || null, //6
      req.session.user.id, //7
      req.body.description, //8
    ],
  };
  let sqlPUpdate = {
    text: /*sql*/ `
    update ${tabname} set 
    email = $2,
    u_name = $3,
    u_fam = $4,
    u_otch = $5,
    rereg = $6,
    user_id = $7,
    description = $8,
    user_date = CURRENT_TIMESTAMP
    where id = $1
    RETURNING id;
`,
    values: [
      req.body.id,
      req.body.email,
      req.body.user_name,
      req.body.user_fam,
      req.body.user_otch,
      req.body.rereg,
      req.session.user.id,
      req.body.description,
    ],
  };
  // удаляем при сбросе регистрации
  let sqlPDelete = {
    text: /*sql*/ `
    DELETE FROM users_login
    WHERE email = $1
    RETURNING email
    `,
    values: [req.body.email],
  };
  // меняем статус при регистрации или разрегистрации
  // let sqlPUpdateStatus = {
  //   text: /*sql*/ `
  //   UPDATE users_login SET
  //   status = $2
  //   WHERE email = $1
  //   RETURNING *
  //   `,
  //   values: [req.body.email, req.body.status],
  // };

  // if (idOne) sqlP.values = [timezone, idOne];
  //  console.log("wher", sqlP, req.body);

  // что именно выполняем или update или insert
  let querySql = req.body.id ? sqlPUpdate : sqlP;
  try {
    let result = await pool.query(querySql);
    result = result.rowCount > 0 ? result.rows : null;

    if (
      req.body.id &&
      req.body.rereg // если выставлен флаг rereg при update, удаляем из users_login
      // req.body?.email != req.session?.user?.email
    ) {
      let resultDel = await pool.query(sqlPDelete);
      resultDel = resultDel.rowCount > 0 ? resultDel.rows : null;
      if (resultDel) {
        console.log("Удалили: ", resultDel[0]?.email);
        req.body.status = "NotLogin"; //! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX продумать статусы, это фикция только отсюда подразумеваем
        // установили здесь, а менять будем дальше
      } else {
        console.log("хотели, но не нашли кого удалить");
      }
    }
    // Обновляем статус, просто потому что есть id в req.body.id
    if (req.body.id) {
      await updateStatus(req, res, tabname, timezone, idOne);
      // let resultUpdate = await pool.query(sqlPUpdateStatus);
      // resultUpdate = resultUpdate.rowCount > 0 ? resultUpdate.rows : null;
      // if (resultUpdate) {
      //   console.log(
      //     "Обновили статус: ",
      //     resultUpdate[0].id,
      //     resultUpdate[0]?.email
      //   );
      //   // await redisSetUserReload(resultUpdate[0].id);
      // } else {
      //   console.log("хотели, но не нашли кому статус обновить");
      // }
    }
    //   console.log("territory", result);
    // let mess = `Читаем Пекарни`;
    // botSendMessage(mess, req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
