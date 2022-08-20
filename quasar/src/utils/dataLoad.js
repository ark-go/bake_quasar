import { useState } from "src/utils/useState.js";
import { Notify, Loading } from "quasar";
import { axios } from "boot/axios";
import { nextTick } from "vue";
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
    classes: "q-py-none no-min-height",
    group: false, // required to be updatable
    timeout: 0, // we want to be in control when it gets dismissed
    spinner: true,
    message: "..." + (logInfo || "Что-то загружаем"),
    //  caption: logInfo || "Что-то загружаем",
    position: "top-right",
    color: "blue-grey-4",
    textColor: "white",
  });
  try {
    Loading.show({
      delay: 400, // ms
    });
    let resp = await axios.post(url, data);
    console.dir("resp", resp);
    let respData = resp.data;
    let keyRes = Object.keys(respData);
    if (!keyRes.includes("result") && !keyRes.includes("error")) {
      // может считать страницу 404 и код 200
      console.log("При загрузке ", logInfo, "Нет данных");
      throw " Не полученно данных.";
    }

    if (respData.error) {
      if (
        ["NoAccess", "noautorizate", "WaitManualConfirm"].includes(
          respData.error
        )
      ) {
        //  await axios.post("/api/unLogin", {});

        logInfo += " запрещено.";
      }
      throw respData.error;
    }

    notif({
      icon: "done", // we add an icon
      classes: "q-py-none no-min-height",
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: logInfo || "Загрузили",
      timeout: 2500, // we will timeout it in 2.5s
      progress: true,
    });
    Loading.hide();
    return respData;
  } catch (err) {
    Loading.hide();
    captionErr = err.toString();
    console.log("catch dataLoad.js XXXXXXX", err.toString());
    let captionErr = "";
    let caption = ["NoAccess", "noautorizate", "WaitManualConfirm"].includes(
      err.toString()
    )
      ? "У вас нет доступа!"
      : logInfo + " : " + err.toString();
    if (["WaitManualConfirm"].includes(err.toString())) {
      caption = caption + " Ожидайте подтверждения регистрации";
    }

    if (err.toString().indexOf("Network Error") > 0) {
      captionErr = "Нет интернета ! \r\ng";
    }
    if (err?.response?.status == 429) {
      captionErr = "Не надо часто делать запросы !!";
    }

    notif(); // для закрытия того что не загрузилось.
    Notify.create({
      classes: "notify-error-top",
      position: caption ? "center" : "top",
      // icon: "done", // we add an icon
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: caption ? "Нет доступа." : "Ошибка зарузки!",
      caption: (caption ? caption : captionErr) + " " + logInfo,
      progress: true,
      multiLine: true,
      timeout: 1000 * 30, // we will timeout it in 2.5s
      color: "deep-orange",
      // textColor: "white",
      //closeBtn: true,
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
