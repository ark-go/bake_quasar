import https from "https";
import { parse } from "node-html-parser";
import puppeteer from "puppeteer-core";
export async function testParser(req, res) {
  let resParse = "нет";
  let host = req.body.urlParse;
  let hostl = "";
  let path = "";
  let resString = [];
  await pupitterGet();
  try {
    console.log("host1111", req.body.urlParse);
    hostl = req.body.urlParse
      .trim()
      .match(
        /^(?:http|ftp)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/gm
      );

    if (hostl && hostl.length > 0) {
      host = hostl[0];
      host = host.substring(0, host.length - 1);
      //  path = "/" + hostl[1];
    }
    path = "/" + req.body.urlParse.replace(hostl, "");

    console.log("host", host, path);
    // resParse = await readURL(req.body?.urlParse);
    resParse = await readURL(host, path);
    const root = parse(resParse, {
      //  lowerCaseTagName: true,
    });
    //    let c = root.querySelector(".catalog__item"); //catalog

    let buttonItems = root.querySelectorAll(".base-pagination-wrapper>a");
    let buttonsPage = [];
    if (Array.isArray(buttonItems)) {
      buttonItems.forEach((val, i) => {
        let a = {};
        if (val) {
          a.url = val.attributes.href.trim();
          let button = val.querySelector("button");
          if (button) {
            a.page = button.attributes.page;
          }
        }
        buttonsPage.push(a);
      });
      console.log("button", buttonsPage);
    }
    let h = await mm(host, path); // запрос
    console.log("items", h);

    let currentUrl = path;
    for (let i = 0; i < buttonsPage.length; i++) {
      if (currentUrl == buttonsPage[i].url) {
        continue;
      }
      currentUrl = buttonsPage[i].url;
      console.log("??----->>", buttonsPage[i].url);
      let h = await mm(host, buttonsPage[i].url); // запрос
      console.log("items", h);
    }

    async function mm(host, path) {
      resParse = await readURL(host, path);

      let root = parse(resParse);
      console.log(">>", path);
      let catalogItems = root.querySelectorAll(".catalog__item");

      if (Array.isArray(catalogItems)) {
        let itemNames = "";
        let itemPrice = "";
        catalogItems.forEach((val, i) => {
          let a = {};
          // console.log("items -----------------", i);
          itemNames = val.querySelector("[data-testid='item-name']"); //data-testid="price"
          itemPrice = val.querySelector("[data-testid='price']"); // data-testid="item-name"
          //---
          itemNames = itemNames.querySelector("span");
          a.text = itemNames.text;
          a.price = itemPrice.text;
          resString.push(a);
        });
      }
      return resString;
    }
    console.log(resParse);
    return res.json({
      result: resString,
    });
  } catch (e) {
    console.log("yyy.. error", e);
    return res.json({
      error: " reeeeeeeeee",
    });
  }
}
async function readURL(host, path) {
  console.log("URL", host, path);
  // возвращаем Promise - так как операция чтения может длиться достаточно долго
  return new Promise((resolve, reject) => {
    // встроенный в NodeJS модуль https
    // первый аргумент - url, второй - callback c параметром ответа сервера

    const options = {
      hostname: "www.sima-land.ru", // host,
      path: path,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
        "sec-ch-ua": `"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"`,
        "sec-ch-ua-platform": "Windows",
        // Authorization: 'authKey'
      },
    };

    https
      .get(options, (res) => {
        // получаем статус ответа сервера посредством деструктуризации объекта
        const { statusCode } = res;

        let error;
        if (statusCode !== 200) {
          error = new Error(`Ошибка запроса. Код ответа: ${statusCode}`);
        }

        // при ошибке очищаем память и выходим
        if (error) {
          reject(error);
          res.resume();
          return;
        }

        // устанавливаем кодировку
        res.setEncoding("utf8");

        // собираем данные в строку
        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));

        // после получения всех данных успешно завершаем Промис
        res.on("end", () => resolve(rawData));
      })
      .on("error", (e) => reject(e)); // ошибка -> отклоняем Промис
  });
}
async function pupitterGet() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.sima-land.ru/instrumenty-dlya-dekorirovaniya/?c_id=47326&per-page=20&sort=price&viewtype=list"
  );
  await page.screenshot({ path: "example32.png" });

  await browser.close();
}
