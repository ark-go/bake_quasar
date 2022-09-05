import { app, BrowserWindow, nativeTheme, session, Tray, Menu } from "electron";
import { createTray } from "./tray.js";
import path from "path";
import os from "os";
import { setAppMenu } from "./menuApp.js";
// service worker
// Get all service workers.
function swStart() {
  console.log(session.defaultSession.serviceWorkers.getAllRunning());

  // Handle logs and get service worker info
  session.defaultSession.serviceWorkers.on(
    "console-message",
    (event, messageDetails) => {
      console.log(
        "Got service worker message",
        messageDetails,
        "from",
        session.defaultSession.serviceWorkers.getFromVersionID(
          messageDetails.versionId
        )
      );
    }
  );
}
// end service worker end
// Блок  проверки повторного запуска
let mainWindow = null;
//------------
const platform = process.platform || os.platform();
try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}
// ---------------
let isClose = false;
//let tray = null;
const Store = require("electron-store");
const store = new Store();
// let localSite = "https://bake.x.arkadii.ru/";
let moskovSite = "https://bake.h-i-t.ru/";
// ArkWin11
if (!store.get("currURL")) store.set("currURL", moskovSite);

// --------------
const additionalData = { myKey: "ArkElectonBake" };
// пытается захватить ключ если true - получилось, это единственный экземпляр
const gotTheLock = app.requestSingleInstanceLock(additionalData);

if (!gotTheLock) {
  app.quit();
} else {
  app.on(
    "second-instance",
    (event, commandLine, workingDirectory, additionalData) => {
      // Print out data received from the second instance.
      console.log(additionalData);

      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    }
  );

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow();
    createTray(mainWindow, () => {
      isClose = true;
      mainWindow.close();
      swStart();
    });
  });
}
// конец блока с повторным запуском
setAppMenu();
// needed in case process is undefined under Linux

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    // titleBarStyle: 'customButtonsOnHover',
    autoHideMenuBar: true, // меню только по alt
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  // mainWindow.loadURL(process.env.APP_URL)
  mainWindow.loadURL(store.get("currURL"));

  if (process.env.DEBUGGING) {
    // Если DEBUGGING то сразу открывать
    mainWindow.webContents.openDevTools();
  } else {
    // Закрывать при попытке открыть DevTools
    // mainWindow.webContents.on("devtools-opened", () => {
    //   mainWindow.webContents.closeDevTools();
    // });
  }
  mainWindow.on("close", (ev) => {
    if (isClose) return;
    mainWindow.hide();
    ev.preventDefault(); // отменить закрытие
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

//app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

// app.on("activate", () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
