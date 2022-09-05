import https from "https";
import { parse } from "node-html-parser";
import puppeteer from "puppeteer";
export async function testParser(req, res) {
  let resParse = "нет";
  let host = req.body.urlParse;
  let hostl = "";
  let path = "";
  let resString = [];
  let nn = await pupitterGet(req.body.urlParse);
  return res.json({
    result: nn,
  });
}
async function pupitterGet(urlPage) {
  let browser = null;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    let ge = await page.goto(urlPage);
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      try {
        for (let i = 0; i < msgArgs.length; ++i) {
          console.log("pupetter: ", await msgArgs[i].jsonValue());
        }
      } catch (e) {}
    });
    // await page.screenshot({ path: "example32.png" });
    await page.waitForSelector(".catalog__item", { timeout: 0 });
    const result = await page.evaluate(async () => {
      console.log("Start разбор.");
      // window.scrollBy(0, window.innerHeight);
      // прокрутка страницы
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 300;
        let count = 24;
        var timer = setInterval(() => {
          console.log("Scroll....");
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          console.log(totalHeight, scrollHeight, count);
          count--;
          if (totalHeight >= scrollHeight || count < 0) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
      // f//////////
      //

      let catalogItems = Array.from(
        document.querySelectorAll(".catalog__item")
      );
      console.log("catalogItems", catalogItems.length);
      //---
      // catalogItems = document.querySelectorAll(".catalog__item");
      let resString = [];

      let itemNames = "";
      let itemPrice = "";
      let itemPrice2 = "";
      //catalogItems.forEach((val, i) => {
      for (let i = 0; i < catalogItems.length; i++) {
        let a = {};
        // console.log("items -----------------", i); data-testid="item-price"

        itemNames = catalogItems[i].querySelector(
          `[data-testid="item-name"] span`
        ); //data-testid="price"
        itemPrice = catalogItems[i].querySelector("[data-testid='price']"); // data-testid="item-name"

        itemPrice2 = catalogItems[i].querySelector(
          `[data-testid="item-price"] span`
        ); //data-testid="price"
        //---
        //  itemNames = itemNames.querySelector("span");

        a.price = itemPrice.innerText;
        a.price2 = itemPrice2.innerText;
        a.text = itemNames.innerText;
        resString.push(a);
        console.log("a: ", a);
      }

      //--
      return resString;
    });
    console.log("res", result);
    //  await page.h
    await browser.close();
    console.log("Выход");
    return result;
  } catch (e) {
    console.log("error puppeter", e);
  } finally {
    // if (browser) await browser.close();
  }
}
