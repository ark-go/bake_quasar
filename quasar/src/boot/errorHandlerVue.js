// Подключаем собственный магазин
import { boot } from "quasar/wrappers";
import { Notify } from "quasar";
export default boot(({ app }) => {
  window.onerror = function (message, source, lineno, colno, error) {
    console.log("window-error (boot)", message);
  };
  app.config.errorHandler = (err, vm, info) => {
    console.error("Vue error (boot):", err);
    // ловим пропадание сети да и все осатльные ошибки
    let caption = "";
    let captionErr = "";
    if (err.toString().indexOf("fetch dynamically imported") > 0) {
      caption =
        "Ошибка загрузки модуля<br>проверьте подключение интернета.<br>перезагрузите страницу";
    } else {
      captionErr = err.toString();
    }
    if (err.toString().indexOf("Unable to preload CSS") > 0) {
      caption =
        "Ошибка загрузки модуля css<br>проверьте подключение интернета.<br>перезагрузите страницу";
    } else {
      captionErr = err.toString();
    }

    Notify.create({
      classes: "notify-error-top",
      position: "top",
      // icon: "done", // we add an icon
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: caption ? "Ошибка интернета!" : "Ошибка программы: 1243",
      caption: caption ? caption : captionErr,
      progress: true,
      multiLine: true,
      timeout: 1000 * 30, // we will timeout it in 2.5s
      color: "deep-orange",
      html: caption ? true : false,
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
  };
});
