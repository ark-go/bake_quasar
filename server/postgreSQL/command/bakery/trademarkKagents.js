import { pool } from "../../initPostgreSQL.js";
import { botSendMessage } from "../../../tg/startTgBot.js";

// ищем всех контрагентов у торговой сети
// и выкидываем фпаншиз
export async function trademarkKagents(req, res, timezone) {
  let kagentSql = {
    text: /*sql*/ `
    SELECT
    id,
    name,
    franchising,
    owncompany
    FROM kagent
    -- правое справа у нас всегда меньше агентов чем слева, поэтому нулевых строк не будет
    -- все совпадающие строки обязательно совпадут с правыми, проврка на NULL не нужна 
    -- а с LEFT можно было проверить NULL, так как как слева больше чем справа и все недостающие будут нулями
    RIGHT JOIN ( 
          select kagent_id from kagent_tm  -- все контрагенты у которых есть торговая сеть
          where trademark_id = $1) as trad 
          on trad.kagent_id = kagent.id    -- из всех контрагентов слева выбрать по правым найденым контрагентам
  -- если нет поля, или в этом поле не true
  -- тут не может быть  WHERE meta ->> 'system_select' IS NULL OR NOT meta ->> 'system_select' = 'true'
    ORDER BY name
`,
    values: [req.body.trademark_id],
  };
  try {
    let result = await pool.query(kagentSql);
    result = result.rowCount > 0 ? result.rows : null;

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
