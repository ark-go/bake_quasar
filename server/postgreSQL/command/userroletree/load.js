import { pool } from "../../initPostgreSQL.js";
import { nestedSets } from "../../../utils/nestedSets.js";
import { botSendMessage } from "../../../tg/startTgBot.js";
//import { io } from "../../../modules/ioSocket/startIoSocket.js";
// import escape from "pg-escape";

export async function load(req, res, tabname, timezone, idOne) {
  // работает io.sockets.in("system web arkadii").emit("on-reload-tree", "mainTree");
  // io.sockets.in("room").emit("event_name", data);
  // let wher = idOne ? "WHERE " + tabname + ".id = $2" : "";
  console.log("load tree", req.body);
  let sqlP = {
    text: /*sql*/ `
      SELECT 
      ${tabname}.id,
      ${tabname}.root,
      ${tabname}.lft,
      ${tabname}.rgt,
      ${tabname}.level,
      ${tabname}.name
      FROM ${tabname}
      WHERE NOT ${tabname}.meta @> '{"hidden":true}'  -- содержит ли meta такой ключ с таким значением
      AND level = 0
`,
    values: [],
  };
  let sqlPAll = {
    text: /*sql*/ `
      SELECT 
      ${tabname}.id,
      ${tabname}.root,
      ${tabname}.lft,
      ${tabname}.rgt,
      ${tabname}.level,
      ${tabname}.name
      FROM ${tabname}
      WHERE NOT ${tabname}.meta @> '{"hidden":true}'  -- содержит ли meta такой ключ с таким значением
      AND level < 20 
      order by  ${tabname}.root, ${tabname}.lft;
`,
    values: [],
  };
  let sqlPChild = {
    text: /*sql*/ `
      SELECT 
      ${tabname}.id,
      ${tabname}.root,
      ${tabname}.lft,
      ${tabname}.rgt,
      ${tabname}.level,
      ${tabname}.name
      FROM ${tabname}
      WHERE NOT ${tabname}.meta @> '{"hidden":true}'  -- содержит ли meta такой ключ с таким значением
      AND root = $1
      AND (lft > $2 AND rgt < $3) AND level = $4 
`,
    values: [
      req.body.root,
      req.body.lft,
      req.body.rgt,
      1 + Number(req.body.level),
    ],
  };
  let sqlPId = {
    text: /*sql*/ `
      SELECT 
      ${tabname}.id,
      ${tabname}.root,
      ${tabname}.lft,
      ${tabname}.rgt,
      ${tabname}.level,
      ${tabname}.name
      FROM ${tabname}
      WHERE NOT ${tabname}.meta @> '{"hidden":true}'  -- содержит ли meta такой ключ с таким значением
      AND id = $1
`,
    values: [req.body.id],
  };
  try {
    let result = [];
    if (req.body.id) {
      result = await pool.query(sqlPId);
    } else if (req.body.lft && req.body.rgt) {
      result = await pool.query(sqlPChild);
    } else {
      result = await pool.query(sqlPAll);
      result = result.rowCount > 0 ? result.rows : [];
      result = nestedSets(result);
      //console.log("tree all", result);
      return {
        result: {
          nodes: result,
        },
      };
    }
    result = result.rowCount > 0 ? result.rows : null;
    //console.log("departments", result);
    let mess = `Load ${tabname}`;
    botSendMessage(mess, req);
    // console.log("tree child:", result);
    return {
      result: {
        nodes: treeToJson(result),
        currentId: idOne,
      },
    };
  } catch (err) {
    console.log("Ошибка чтения ", tabname, err.toString());
    return {
      error: err.toString(),
    };
  }
}
function treeToJson(Arr) {
  let A = [];
  Arr.forEach((element) => {
    if (element.rgt - element.lft != 1) {
      // element.children = [];
      element.lazy = true;
    }
    A.push(element);
  });
  console.log("dd", A);
  return A;
}
