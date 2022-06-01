import { useState } from "src/utils/useState.js";
import { Notify, Loading } from "quasar";
import { axios } from "boot/axios";
import { Dark } from "quasar";
/**
 *
 * @param {string} url Адрес
 * @param {object} data  данные для передачи
 * @param {string} logInfo для  Notify и log/
 * @returns
 */
export async function dataLoad(url, data, logInfo = "") {
  //Dark.set(true);
  const notif = Notify.create({
    group: false, // required to be updatable
    timeout: 0, // we want to be in control when it gets dismissed
    spinner: true,
    message: "Загрузка...",
    caption: logInfo || "Что-то загружаем",
    position: "top-right",
    color: "blue-grey-4",
    textColor: "white",
  });
  try {
    Loading.show({
      delay: 400, // ms
    });
    let resp = await axios.post(url, data);
    let respData = resp.data;
    let keyRes = Object.keys(respData);
    if (!keyRes.includes("result") && !keyRes.includes("error")) {
      // может считать страницу 404 и код 200
      console.log("При загрузке ", logInfo, "Нет данных");
      throw " Не полученно данных.";
    }
    if (respData.error) {
      if (respData.error == "NoAccess") {
        logInfo = "Нет доступа!";
      }
      throw respData.error;
    }

    notif({
      icon: "done", // we add an icon
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: "Готово!",
      caption: logInfo || "Загрузили",
      timeout: 2500, // we will timeout it in 2.5s
      progress: true,
    });
    Loading.hide();
    return respData;
  } catch (err) {
    Loading.hide();
    console.log("XXXXXXXXX", err.toString());
    let caption = ["NoAccess", "noautorizate"].includes(err.toString())
      ? "У вас нет доступа!"
      : logInfo + " : " + err.toString();
    notif(); // для закрытия того что не загрузилось.
    Notify.create({
      classes: "notify-error-top",
      position: "top",
      // icon: "done", // we add an icon
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: ["NoAccess", "noautorizate"].includes(err.toString())
        ? "Нет доступа."
        : "Ошибка зарузки!",
      caption: caption,
      progress: true,
      multiLine: true,
      timeout: 1000 * 30, // we will timeout it in 2.5s
      color: "deep-orange",
      //ignoreDefaults: true,
      actions: [
        {
          label: "Закрыть",
          color: "yellow",
          textColor: "white",
          handler: () => {
            /* ... */
          },
        },
      ],
    });
    console.log(err);
    return {
      error: "Ошибка: " + logInfo + " : " + err.toString(),
    };
  }
}
