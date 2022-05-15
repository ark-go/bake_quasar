import { ingredientSostavQuery } from "./ingredient/ingredientSostavQuery.js";
import { priceAllQuery } from "./price/priceAllQuery.js";
import { botSendMessage } from "../../tg/startTgBot.js";
export async function pdfMainLoad(req, res) {
  if (!req.body?.command) {
    return {
      error: "Не правильный запрос 1",
    };
  }
  if (!req.session?.user) {
    return {
      error: "Нельзя",
    };
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
  let mess = `PDF: ${req.body?.command} / ${req.body?.commandExt?.actionType}`;
  botSendMessage(mess, req);

  switch (req.body.command) {
    case "products":
      return await ingredientSostavQuery(req, res);
    case "priceAll":
      return await priceAllQuery(req, res);
    default:
      return {
        error: "Не указана цель",
      };
  }
}
