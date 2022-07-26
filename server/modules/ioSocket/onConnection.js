import moment from "moment-timezone";
import { escape } from "html-sloppy-escaper";
import { startCheckVersionSite } from "./startCheckVersionSite.js";
export function onConnection(io, socket) {
  const sessionId = socket.request?.session?.id;
  socket.join(sessionId); // запомним сессию ID
  // в комнату самого себя
  socket.join(socket.request.session.user.email);
  // общая комната
  socket.join("siteCommandShare"); //!TODO сделать!! комната для всех общих сообщений сайта,
  socket.join("public room");
  socket.join("system web arkadii");
  socket.join("sysroom"); // группа для системных сообщений
  // комната Админ
  // socket.join("admin room");
  socket.data.username = socket.request?.session?.user?.email; // в data сувать что хочешь
  socket.data.fio = socket.request?.session?.user?.fio;
  socket.data.userBrowser = socket.request?.session?.userBrowser;
  // socket.data.userAgent = socket.request?.session?.userAgent;
  //socket.data.timezone = socket.request?.session?.timezone;
  socket.data.ipAddress = socket.request?.session?.ipAddress;
  // отправить всем в комнате, кроме отправителя
  //   socket
  //     .to(socket.request.session.user.email)
  //     .emit("HELL", { date: "Вы еще гдето подключились" });
  socket
    .to(socket.request.session.user.email)
    .emit("SOUND", { date: "Вы еще гдето подключились" });

  socket.emit("HELL", {
    date: moment
      .tz(Date.now(), socket.request?.session?.timezone)
      .format("DD-MM-YYYY HH:mm"),
  });
  // проверяем версию раз в мин
  startCheckVersionSite(socket);

  console.log(
    "IO Подключился:",
    socket.request?.session?.user?.email +
      " - " +
      socket.request?.session?.user?.fio +
      " : " +
      socket.request?.session?.timezone
  );

  console.log("IO Кол-во клиентов", io.engine.clientsCount);
  let clients = io.sockets.sockets;
  clients.forEach((val, key) => {
    console.log(
      ">> ",
      val.data.username +
        " : " +
        val.data.userBrowser?.timezone +
        " : " +
        val.data.userBrowser?.name +
        " : " +
        val.data.userBrowser?.os +
        " : " +
        val.data.ipAddress
    );
  });
  // приняв сообщение, оно рассылается по всем кто находится в комнате,sysroom
  // логики вступления в группу пока еще нет, и там все пользователи
  // серверу сама команда не нужна, но ее будут ловить все клиенты
  socket.on("sysroom", (val) => {
    console.log("broadcast прислал ", val);
    if (val.command) {
      val.userFio = socket.data.fio;
      console.log(">>E>>", val, socket.data);
      console.log(">>E>>", val, socket.data);
      socket.to("sysroom").emit("sysroom", val);
    }
  });
  //-------------
  socket.on("system_website", (val) => {
    if (val.room && val.msg) {
      socket.to(val.room).emit("on-reload-tree", { date: "Обновление дерева" });
    }
  });

  socket.on("gameCursor", (val) => {
    socket.to("system web arkadii").emit("gameCursor", val);
  });

  socket.on("disconnect", (reason) => {
    // Отключился Причина: transport close
    //https://socket.io/docs/v4/server-api/#event-disconnect
    console.log(
      "IO Отключился Причина:",
      reason,
      " : " + socket.data?.ipAddress
    );
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
  socket.on("getAllUsers", (payload, callback) => {
    console.log("нажал на сайте", payload);
    let clients = io.sockets.sockets;
    let mess = "";

    clients.forEach((val, key) => {
      let tz = val.data.userBrowser?.timezone;
      if (tz) {
        tz = tz.split("/");
        if (tz.length > 1) {
          tz = tz[1];
        }
      }
      mess +=
        escape(
          val.data.username +
            " : " +
            tz +
            " : " +
            val.data.userBrowser?.name +
            " : " +
            val.data.userBrowser?.os +
            " : " +
            val.data.ipAddress
        ) + "<br />";
    });

    return callback({ allUsers: mess });
  });
}
