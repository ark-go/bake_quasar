import { ingredientSostavQuery } from "./ingredient/ingredientSostavQuery.js";
import { priceAllQuery } from "./price/priceAllQuery.js";
import { botSendMessage } from "../../tg/startTgBot.js";
export async function pdf(req, res) {
  // res.type('application/json')
  //res.vary('pdf').render('docs') // хз
  if (!req.body?.command) {
    return res.status(400).json({ error: "Не правильный запрос pdf" });
  }
  if (!req.session?.user) {
    return res.status(401).json({ error: "Нельзя вам pdf" });
  }
  // req.body
  // id - id для выборки
  // typePdf -  file/base64 что вернуть
  // command  - куда направить
  // tg - pdf/jpg/ undefined -  телеграмм
  req.body.tgFormat = "pdf"; // пока для всего

  // req.session.user.currentPdf = {};
  // req.session.user.currentPdf.pdf = {};
  // req.session.user.currentPdf.pdf.id = req.body?.id;
  // if (req.body.command == "products") {
  //   return await ingredientSostavQuery(req, res);
  // }
  let mess = `PDF: ${req.body?.command} / ${req.body?.actionType}`;
  botSendMessage(mess, req);

  switch (req.body.command) {
    case "products":
      return await ingredientSostavQuery(req, res);
    case "priceAll":
      return await priceAllQuery(req, res);
    default:
      return res.status(400).json({ error: "Не указана цель pdf" });
  }
}
