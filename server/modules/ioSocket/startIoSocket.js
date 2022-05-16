import { Server as ioServer } from "socket.io";
import fs from "fs";
//import { redisClient } from "../../utils/ioredisStore.js";
//const { createAdapter } = require("@socket.io/redis-adapter");

import moment from "moment-timezone";
export function startIoSocket(serverHTTP, expressSession) {
  const io = new ioServer(serverHTTP, {
    // maxHttpBufferSize: 1e8, // читать.. по умолчанию 1мб полезная нагрузка итаймаут
    // pingTimeout: 60000, // если большой размер, ошибки пинга вызывают отключение.. время можно увеличить
    cors: {
      // origin: "" // наш адрес сюда с портом
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(expressSession));

  // only allow authenticated users
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const sessionId = socket.request?.session?.id;
    socket.join(sessionId); // запомним сессию ID
    // в комнату самого себя
    socket.join(socket.request.session.user.email);
    // общая комната
    socket.join("public room");
    // комната Админ
    // socket.join("admin room");
    socket.data.username = socket.request?.session?.user?.email; // в data сувать что хочешь
    // отправить всем в комнате, кроме отправителя
    socket
      .to(socket.request.session.user.email)
      .emit("HELL", { date: "Вы еще гдето подключились" });
    socket
      .to(socket.request.session.user.email)
      .emit("SOUND", { date: "Вы еще гдето подключились" });

    socket.emit("HELL", {
      date: moment
        .tz(Date.now(), socket.request?.session?.timezone)
        .format("DD-MM-YYYY HH:mm"),
    });
    // проверяем версию раз в мин
    let timerInt = setInterval(() => {
      sendVersionSite(socket, timerInt);
    }, 60000);
    // console.log("IO session", JSON.stringify(socket.request.session, 0, 2));
    console.log("IO Подключился:", socket.request?.session?.timezone);
    console.log("IO Подключился:", socket.request?.session?.user?.email);
    console.log("IO Кол-во клиентов", io.engine.clientsCount);
    let clients = io.sockets.sockets;
    clients.forEach((val, key) => {
      console.log("IO Клиенты", val.data.username);
    });

    socket.on("IO disconnect", (reason) => {
      //https://socket.io/docs/v4/server-api/#event-disconnect
      console.log("IO Отключился Причина:", reason);
      console.log("IO Кол-во клиентов", io.engine.clientsCount);
    });
    // console.log("IO транспорт", socket.io.engine.transport.name);
    // socket.io.engine.on("upgrade", () => {
    //   console.log("IO Смена транспорта", socket.io.engine.transport.name); // in most cases, "websocket"
    // });
    socket.on("connect_failed", function () {
      console.log("IO Connection Failed");
    });
    socket.on("connect_error", (err) => {
      console.log("IO connect_error ", err.message); // prints the message associated with the error
    });
  });

  io.engine.on("connection_error", (err) => {
    // console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });
}
// disconnect all Socket.IO connections linked to this session ID
//io.to(sessionId).disconnectSockets();
function sendVersionSite(socket) {
  fs.readFile(
    "/home/arkadii/Projects/bake/quasar/package.json",
    "utf8",
    (err, data) => {
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
    }
  );
}
