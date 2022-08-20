import { app, Menu } from "electron";
export function setAppMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "Файл",
      submenu: [
        isMac ? { role: "close" } : { label: "Свернуть", role: "quit" },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Редакт",
      submenu: [
        { label: "Назад", role: "undo" },
        { label: "Вперед", role: "redo" },
        { type: "separator" },
        { label: "Вырезать", role: "cut" },
        { label: "Копировать", role: "copy" },
        { label: "Вставить", role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [
              { label: "Удалить", role: "delete" },
              { type: "separator" },
              { label: "Выбрать все", role: "selectAll" },
            ]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "Вид",
      submenu: [
        { label: "Перегрузить", role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { label: "Вернуть масштаб", role: "resetZoom" },
        { label: "Масштаб +", role: "zoomIn" },
        { label: "Масштаб -", role: "zoomOut" },
        { type: "separator" },
        { label: "Полный экран", role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Окно",
      submenu: [
        { label: "Минимизировать", role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ label: "Свернуть", role: "close" }]),
      ],
    },
    // {
    //   role: "help",
    //   submenu: [
    //     {
    //       label: "Learn More",
    //       click: async () => {
    //         const { shell } = require("electron");
    //         await shell.openExternal("https://electronjs.org");
    //       },
    //     },
    //   ],
    // },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
