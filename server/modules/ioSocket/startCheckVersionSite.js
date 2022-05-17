import fs from "fs";
import moment from "moment-timezone";
export function startCheckVersionSite(socket) {
  let timerInt = setInterval(() => {
    sendVersionSite(socket, timerInt);
  }, 60000);
}
function sendVersionSite(socket) {
  fs.readFile(process.env.PackagePath, "utf8", (err, data) => {
    if (err) {
      console.log(`Не прочитать Package файл от Quasar: ${err}`);
    } else {
      const pack = JSON.parse(data);
      // console.log("Версия сайта на сервере:", pack.version);
      let mom = moment.tz(Date.now(), socket.request?.session?.timezone);
      socket.emit("updateSite", {
        date:
          socket.request?.session?.timezone +
          ": " +
          mom.format("DD-MM-YYYY HH:mm"),
        versionSiteServer: pack.version,
      });
    }
  });
}
