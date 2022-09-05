import { app, BrowserWindow, nativeTheme, Tray, Menu } from "electron";
import path from "path";
import os from "os";
import Store from "electron-store";
const store = new Store();
const computerName = os.hostname();
const yesLocal = ["arkwin11", "zina", "alinazen-pc"].includes(
  computerName.toLowerCase()
);
let localSite = "https://bake.x.arkadii.ru/";
let moskovSite = "https://bake.h-i-t.ru/";
export function createTray(mainWindow, closeApp) {
  if (!mainWindow) return;
  const tray = new Tray(path.resolve(__dirname, "icons/icon.png"));
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
        closeApp(); // callbak для закрытия
        //  isClose = true;
        //  mainWindow.close();
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
}
