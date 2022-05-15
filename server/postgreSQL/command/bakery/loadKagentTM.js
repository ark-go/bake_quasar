import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";

// ищем всех контрагентов у торговой сети
// и выкидываем фпаншиз
export async function loadKagentTM(req, res, timezone) {
  let kagentSql = {
    text: /*sql*/ `
    SELECT
    kagent_tm.id,
    kagent.name,
    kagent.franchising,
    kagent.owncompany
    FROM kagent_tm
    LEFT JOIN kagent ON kagent.id = kagent_tm.kagent_id
    WHERE trademark_id = $1
    ORDER BY kagent.name



  --  id,
  --  name,
  -- franchising,
  --  owncompany
  --  FROM kagent
  --  RIGHT JOIN ( 
  --        select kagent_id from kagent_tm
  --        where trademark_id = $1) as trad 
  --        on trad.kagent_id = kagent.id
  -- если нет поля, или в этом поле не true
  -- тут не может быть  WHERE meta ->> 'system_select' IS NULL OR NOT meta ->> 'system_select' = 'true'
  --  ORDER BY name
`,
    values: [req.body.trademark_id],
  };
  try {
    let result = await pool.query(kagentSql);
    result = result.rowCount > 0 ? result.rows : null;
    console.log("load loadKagentTM", req.body.trademark_id, result);
    botSendMessage("Запрос справочника контрагеты торговой сети", req);
    return {
      result: result,
    };
  } catch (err) {
    console.log("Ошибка чтения trademarkAgetns: ", err.toString());
    return {
      error: err.toString(),
    };
  }
}
