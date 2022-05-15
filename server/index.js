#!/usr/bin/ node
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { log } from "./utils/arkLog.js"; //  логи цветные...
//import { initSoket } from "./modules/ioSocket/initSocket.js";
import path from "path";
import { rootDir } from "./dirModule.cjs";
import http from "http";
//import { Server as ioServer } from "socket.io";
import { startIoSocket } from "./modules/ioSocket/startIoSocket.js";
//require("../modules/logger");
let workDir = path.join(rootDir, ".");
process.chdir(workDir); // установим текущую рабочую каталог
console.log("Рабочий каталог:", workDir);

if (!process.env.APP_port) {
  throw "Не прочитать переменные среды";
}
// ставлю на всякий случай, много что зависит от него
process.env.NODE_ENV = "production";

let { app, expSession } = await import("./app.js"); // там вcя хуйня типа старт, хотим грузить после, поэтому await

let port = process.env.APP_port; // 8878

app.set("trust proxy", 1); // говорим что доверяем первому прокси и верим что там https
let server = http.createServer(app);
startIoSocket(server, expSession); // Уходим в ioSocket
//  -----------------------------------------------------------  Socket
// const io = new ioServer(server, {
//   cors: {
//     // origin: "" // наш адрес сюда с портом
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
//io.attach(server);

// io.on("connection", (socket) => {
//   console.log("IO Подключился:");
//   console.log("Кол-во клиентов", io.engine.clientsCount);
//   socket.data.username = "alice"; // в data сувать что хочешь
//   socket.on("disconnect", (reason) => {
//     //https://socket.io/docs/v4/server-api/#event-disconnect
//     onsole.log("IO Отключился Причина:", reason);
//     console.log("Кол-во клиентов", io.engine.clientsCount);
//   });
// });
// console.log("Кол-во клиентов", io.engine.clientsCount);
// io.engine.on("connection_error", (err) => {
//   console.log(err.req); // the request object
//   console.log(err.code); // the error code, for example 1
//   console.log(err.message); // the error message, for example "Session ID unknown"
//   console.log(err.context); // some additional error context
// });
//initSoket(server, expSession); // io Socket
//  ------------------------------------------------------------- socket end
// Прослушивание на предоставленном порту, на всех сетевых интерфейсах.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
// Прослушиватель событий для ошибки HTTP-сервера.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  let bind = "Port " + port;
  // обрабатывать определенные ошибки прослушивания с дружественными сообщениями
  switch (error.code) {
    case "EACCES":
      console.error(bind + " требует повышенных привилегий");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " уже используется");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Прослушиватель событий для «прослушивания» HTTP-сервера.
function onListening() {
  var addr = server.address();
  log(log.warning, "Старт сервера на порту " + addr.port + "  ==>");
}
