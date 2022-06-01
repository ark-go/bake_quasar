import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TG_botToken);
try {
  bot.start((ctx) => ctx.reply("Привет."));
  console.log("Старт телеграм бот.");
  bot.help((ctx) => ctx.reply("Справок не даем."));
  bot.on("sticker", (ctx) => ctx.reply("👍"));
  bot.hears("hi", (ctx) =>
    ctx.reply("Да, привет " + ctx.chat.first_name + ", Твой ID: " + ctx.chat.id)
  );
  bot.launch();
} catch (e) {
  console.log("Ошибка старта Telegran bot");
  bot = null;
}

export function botSendMessage(message, req) {
  let idBotUser = "";
  let userEmail = req?.session?.user?.email || "?";
  try {
    idBotUser = req?.session?.user?.telegramId;

    if (idBotUser) {
      bot.telegram
        .sendMessage(idBotUser, userEmail + ": " + message) // { disable_notification: true, }
        .then(() => {})
        .catch((e) => {
          console.log("Ошибка бота1", e);
        });
    }
    if (idBotUser != process.env.TG_adminId) {
      bot.telegram
        .sendMessage(process.env.TG_adminId, userEmail + ": " + message)
        .then(() => {})
        .catch((e) => {
          console.log("Ошибка бота2", e);
        });
    }
  } catch (e) {
    console.log("Ошибка бота3", e);
  }
}

export function sendDocument(req, doc) {
  if (req?.session?.user?.telegramId) {
    bot.telegram
      .sendDocument(req.session.user.telegramId, doc)
      .then(() => {})
      .catch((e) => {
        console.log("Ошибка при отправке документа телеграм", e);
      });
  }
}

export { bot };
