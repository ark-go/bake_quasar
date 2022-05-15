import { Telegraf } from "telegraf";
export let bot;
export function startBot() {
  bot = new Telegraf(process.env.TG_botToken);
  try {
    bot.start((ctx) => ctx.reply("Привет."));
    console.log("Старт телеграм бот.");
  } catch (e) {
    console.log("Ошибка старта Telegran bot");
  }
  bot.help((ctx) => ctx.reply("Справок не даем."));
  bot.on("sticker", (ctx) => ctx.reply("👍"));
  bot.hears("hi", (ctx) => ctx.reply("Да, привет."));
  bot.launch();
}
