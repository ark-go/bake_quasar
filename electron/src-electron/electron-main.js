import { app, BrowserWindow, nativeTheme, Tray, Menu } from "electron";
import path from "path";
import os from "os";
import { setAppMenu } from "./menuApp.js";
// app.on("window-all-closed", () => {
//   app.quit();
// });

const Store = require("electron-store");
const store = new Store();
let localSite = "https://bake.x.arkadii.ru/";
let moskovSite = "https://bake.h-i-t.ru/";
// ArkWin11
if (!store.get("currURL")) store.set("currURL", moskovSite);
const computerName = os.hostname();
const yesLocal = ["arkwin11", "zina", "alinazen-pc"].includes(
  computerName.toLowerCase()
);
setAppMenu();
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
//----------
let isClose = false;
let tray = null;

// let currentSite = {
//   sitepath:"https://bake.h-i-t.ru/",

// }
app.whenReady().then(() => {
  tray = new Tray(path.resolve(__dirname, "icons/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Москва",
      type: "radio",
      checked: store.get("currURL") == moskovSite,
      click: () => {
        store.set("currURL", moskovSite);
        mainWindow.loadURL(moskovSite);
        mainWindow.show();
      },
    },
    {
      label: "Не лазить",
      type: "radio",
      visible: yesLocal,
      checked: store.get("currURL") == localSite,
      click: () => {
        store.set("currURL", localSite);
        mainWindow.loadURL(localSite);
        mainWindow.show();
      },
    },
    {
      type: "separator",
    },
    // {
    //   label: "Показать",
    //   click: function () {
    //     mainWindow.show();
    //   },
    // },
    {
      label: "Закрыть",
      click: () => {
        isClose = true;
        mainWindow.close();
      },
    },
  ]);
  tray.setToolTip("Лепешки");
  tray.setTitle("Аркадий");
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
  tray.setContextMenu(contextMenu);
});
//------------
try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

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
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
