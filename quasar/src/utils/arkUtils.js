import { ref } from "vue";
import { date } from "quasar";
import { useQuasar } from "quasar";
import { axios } from "boot/axios";
import { sanitizeDef } from "./sanitize.js";

export function useArkUtils() {
  const $q = useQuasar();
  /**
   *
   * @param {string} url Адрес
   * @param {object} data  данные для передачи
   * @param {string} logInfo для  Notify и log/
   * @returns
   */
  async function dataLoad(url, data, logInfo = "") {
    //Dark.set(true);
    const notif = $q.notify({
      classes: "q-py-none",
      // iconSize: "10px",
      group: false, // required to be updatable
      timeout: 0, // we want to be in control when it gets dismissed
      spinner: true,
      message: "..." + sanitizeDef(logInfo || "Что-то загружаем"),
      // caption: sanitizeDef(logInfo || "Что-то загружаем"),
      position: "top-right",
      color: "blue-grey-4",
      textColor: "white",
      html: true,
    });
    try {
      $q.loading.show({
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
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: sanitizeDef(logInfo || "Загрузили"),
        timeout: 2500, // we will timeout it in 2.5s
        progress: true,
        html: true,
      });
      $q.loading.hide();
      return respData;
    } catch (err) {
      $q.loading.hide();
      console.log("dataLoad.js ERROR:", err.toString());
      let captionErr = "";
      let caption = ["NoAccess", "noautorizate", "WaitManualConfirm"].includes(
        err.toString()
      )
        ? "У вас нет доступа!"
        : logInfo + " :<br>" + err.toString();
      if (["WaitManualConfirm"].includes(err.toString())) {
        caption = caption + "<br>Ожидайте подтверждения регистрации";
      }

      if (err.toString().indexOf("Network Error") > 0) {
        captionErr = "Нет интернета !";
      } else {
        captionErr = err.toString();
      }

      notif(); // для закрытия того что не загрузилось.
      $q.notify({
        classes: "notify-error-top",
        position: caption ? "center" : "top",
        // icon: "done", // we add an icon
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: caption ? "Нет доступа." : "Ошибка зарузки!",
        caption: sanitizeDef(
          (caption ? caption : captionErr) + "<br>" + logInfo
        ),
        progress: true,
        multiLine: true,
        timeout: 1000 * 30, // we will timeout it i
        color: "deep-orange",
        html: true,
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
  return { dataLoad };
}
